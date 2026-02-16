import os
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from pymongo import MongoClient
import httpx

app = FastAPI(title="WMS 3PL API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[        
"https://newstaq-frontend.onrender.com",  # Votre URL frontend en production
"http://localhost:3000"                    # Pour tester en local
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
JWT_SECRET = os.environ.get('JWT_SECRET')
if not JWT_SECRET:
    JWT_SECRET = 'dev-only-secret-key-not-for-production'
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'wms_database')

# MongoDB connection
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

# Helper to convert ObjectId to string
def serialize_doc(doc):
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(d) for d in doc]
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == '_id':
                result['id'] = str(value)
            elif isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, datetime):
                result[key] = value.isoformat()
            elif isinstance(value, list):
                result[key] = serialize_doc(value)
            elif isinstance(value, dict):
                result[key] = serialize_doc(value)
            else:
                result[key] = value
        return result
    return doc

# JWT helpers
def create_token(user):
    return jwt.encode({
        'id': str(user['_id']),
        'username': user['username'],
        'role': user['role'],
        'client_id': str(user['client_id']) if user.get('client_id') else None,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }, JWT_SECRET, algorithm='HS256')

def get_current_user(request: Request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='Token requis')
    try:
        payload = jwt.decode(auth_header[7:], JWT_SECRET, algorithms=['HS256'])
        user = db.users.find_one({'_id': ObjectId(payload['id'])})
        if not user:
            raise HTTPException(status_code=401, detail='Utilisateur non trouvé')
        return serialize_doc(user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expiré')
    except:
        raise HTTPException(status_code=401, detail='Token invalide')

# Initialize database with seed data
def init_db():
    # Check if already initialized
    if db.users.count_documents({}) > 0:
        return
    
    # Create indexes
    db.users.create_index('username', unique=True)
    db.clients.create_index('code', unique=True)
    db.products.create_index([('client_id', 1), ('sku', 1)], unique=True)
    db.orders.create_index('order_number', unique=True)
    db.receipts.create_index('receipt_number', unique=True)
    db.invoices.create_index('invoice_number', unique=True)
    db.carriers.create_index('code', unique=True)
    
    # Seed carriers
    carriers = [
        {'code': 'COLISSIMO', 'name': 'Colissimo', 'type': 'postal', 'tracking_url_template': 'https://www.laposte.fr/outils/suivre-vos-envois?code={tracking}', 'active': True},
        {'code': 'CHRONOPOST', 'name': 'Chronopost', 'type': 'express', 'tracking_url_template': 'https://www.chronopost.fr/tracking-no-cms/suivi-page?liession={tracking}', 'active': True},
        {'code': 'GLS', 'name': 'GLS', 'type': 'standard', 'tracking_url_template': 'https://gls-group.eu/FR/fr/suivi-colis?match={tracking}', 'active': True},
        {'code': 'DHL', 'name': 'DHL Express', 'type': 'express', 'tracking_url_template': 'https://www.dhl.com/fr-fr/home/suivi.html?tracking-id={tracking}', 'active': True},
        {'code': 'UPS', 'name': 'UPS', 'type': 'express', 'tracking_url_template': 'https://www.ups.com/track?loc=fr_FR&tracknum={tracking}', 'active': True},
        {'code': 'FEDEX', 'name': 'FedEx', 'type': 'express', 'tracking_url_template': 'https://www.fedex.com/fedextrack/?trknbr={tracking}', 'active': True},
        {'code': 'MONDIAL_RELAY', 'name': 'Mondial Relay', 'type': 'relay', 'tracking_url_template': 'https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition={tracking}', 'active': True},
        {'code': 'RELAIS_COLIS', 'name': 'Relais Colis', 'type': 'relay', 'tracking_url_template': 'https://www.relaiscolis.com/suivi-de-colis/?code={tracking}', 'active': True},
    ]
    db.carriers.insert_many(carriers)
    
    # Seed warehouse zones
    zones = [
        {'code': 'ZONE-A', 'name': 'Zone A - Réception', 'description': 'Zone de réception marchandises', 'active': True},
        {'code': 'ZONE-B', 'name': 'Zone B - Stockage', 'description': 'Zone de stockage principal', 'active': True},
        {'code': 'ZONE-C', 'name': 'Zone C - Préparation', 'description': 'Zone de préparation commandes', 'active': True},
        {'code': 'ZONE-D', 'name': 'Zone D - Expédition', 'description': 'Zone d\'expédition', 'active': True},
    ]
    zone_results = db.warehouse_zones.insert_many(zones)
    zone_ids = zone_results.inserted_ids
    
    # Seed locations
    locations = []
    for i, zone_id in enumerate(zone_ids):
        for aisle in ['A', 'B', 'C']:
            for rack in range(1, 6):
                for level in range(1, 4):
                    locations.append({
                        'zone_id': zone_id,
                        'code': f'Z{i+1}-{aisle}{rack:02d}-{level}',
                        'aisle': aisle,
                        'rack': str(rack),
                        'level': str(level),
                        'capacity': 100.0,
                        'active': True
                    })
    db.locations.insert_many(locations)
    
    # Seed clients
    clients_data = [
        {'code': 'TECH001', 'name': 'TechStore Pro', 'email': 'contact@techstore.fr', 'phone': '+33 1 23 45 67 89', 'address': '123 Rue Tech, 75001 Paris', 'active': True},
        {'code': 'BIO002', 'name': 'BioMarket', 'email': 'info@biomarket.fr', 'phone': '+33 1 98 76 54 32', 'address': '45 Avenue Bio, 69001 Lyon', 'active': True},
        {'code': 'FASHION003', 'name': 'FashionPlus', 'email': 'hello@fashionplus.fr', 'phone': '+33 1 11 22 33 44', 'address': '78 Boulevard Mode, 13001 Marseille', 'active': True},
        {'code': 'TEST004', 'name': 'Client Test Demo', 'email': 'demo@newstaq.fr', 'phone': '+33 1 00 00 00 00', 'address': '1 Rue Test, 75000 Paris', 'active': True},
    ]
    client_results = db.clients.insert_many(clients_data)
    client_ids = client_results.inserted_ids
    
    # Seed users
    admin_password = bcrypt.hashpw('admin123'.encode(), bcrypt.gensalt()).decode()
    client_password = bcrypt.hashpw('client123'.encode(), bcrypt.gensalt()).decode()
    test_password = bcrypt.hashpw('test'.encode(), bcrypt.gensalt()).decode()
    
    users = [
        {'username': 'admin', 'password': admin_password, 'name': 'Administrateur', 'role': 'admin', 'client_id': None, 'active': True},
        {'username': 'techstore', 'password': client_password, 'name': 'User TechStore', 'role': 'client', 'client_id': client_ids[0], 'active': True},
        {'username': 'biomarket', 'password': client_password, 'name': 'User BioMarket', 'role': 'client', 'client_id': client_ids[1], 'active': True},
        {'username': 'fashionplus', 'password': client_password, 'name': 'User FashionPlus', 'role': 'client', 'client_id': client_ids[2], 'active': True},
        {'username': 'test', 'password': test_password, 'name': 'Utilisateur Test', 'role': 'client', 'client_id': client_ids[3], 'active': True},
    ]
    db.users.insert_many(users)
    
    # Seed products for each client
    categories = ['Électronique', 'Vêtements', 'Accessoires', 'Maison', 'Sport', 'Beauté', 'Alimentation']
    location_docs = list(db.locations.find({'active': True}))
    
    for idx, client_id in enumerate(client_ids):
        products = []
        for i in range(20):
            products.append({
                'client_id': client_id,
                'sku': f'SKU-{idx+1}-{i+1:04d}',
                'name': f'Produit {idx+1}-{i+1}',
                'description': f'Description du produit {i+1}',
                'barcode': f'EAN{idx+1}{i+1:08d}',
                'category': categories[i % len(categories)],
                'unit_weight': round(0.1 + (i * 0.15), 2),
                'min_stock_level': 10,
                'active': True,
                'created_at': datetime.now(timezone.utc)
            })
        product_results = db.products.insert_many(products)
        product_ids = product_results.inserted_ids
        
        # Seed inventory for products
        inventory_items = []
        for j, product_id in enumerate(product_ids):
            loc = location_docs[j % len(location_docs)]
            inventory_items.append({
                'product_id': product_id,
                'location_id': loc['_id'],
                'quantity': 50 + (j * 5),
                'lot_number': f'LOT-{datetime.now().strftime("%Y%m")}-{j+1:03d}',
                'last_updated': datetime.now(timezone.utc)
            })
        db.inventory.insert_many(inventory_items)
    
    # Seed orders for test client (client_ids[3])
    test_products = list(db.products.find({'client_id': client_ids[3]}))
    order_statuses = ['pending', 'picking', 'packed', 'shipped']
    
    for i in range(10):
        order = {
            'order_number': f'TEST-CMD-{i+1:03d}',
            'client_id': client_ids[3],
            'customer_name': f'Client Test {i+1}',
            'customer_email': f'client{i+1}@test.fr',
            'shipping_address': f'{i+1} Rue de Test, 7500{i} Paris, France',
            'order_date': datetime.now(timezone.utc) - timedelta(days=i),
            'status': order_statuses[i % len(order_statuses)],
            'priority': 'medium' if i % 3 == 0 else 'high' if i % 3 == 1 else 'low',
            'tracking_number': f'6A{100000000 + i}FR' if order_statuses[i % len(order_statuses)] == 'shipped' else None,
            'created_at': datetime.now(timezone.utc)
        }
        db.orders.insert_one(order)
    
    # Seed receipts for test client
    receipt_statuses = ['planned', 'in_progress', 'completed']
    for i in range(5):
        receipt = {
            'receipt_number': f'TEST-REC-{i+1:03d}',
            'client_id': client_ids[3],
            'supplier_name': f'Fournisseur Test {i+1}',
            'expected_date': datetime.now(timezone.utc) + timedelta(days=i),
            'status': receipt_statuses[i % len(receipt_statuses)],
            'created_at': datetime.now(timezone.utc)
        }
        db.receipts.insert_one(receipt)
    
    # Seed invoices for test client
    invoice_statuses = ['draft', 'sent', 'paid', 'overdue']
    for i in range(4):
        invoice = {
            'invoice_number': f'TEST-FACT-{i+1:03d}',
            'client_id': client_ids[3],
            'billing_period_start': datetime.now(timezone.utc) - timedelta(days=30),
            'billing_period_end': datetime.now(timezone.utc),
            'issue_date': datetime.now(timezone.utc),
            'due_date': datetime.now(timezone.utc) + timedelta(days=30),
            'subtotal': 500 + (i * 200),
            'tax_rate': 20,
            'tax_amount': (500 + (i * 200)) * 0.2,
            'total': (500 + (i * 200)) * 1.2,
            'status': invoice_statuses[i % len(invoice_statuses)],
            'created_at': datetime.now(timezone.utc)
        }
        db.invoices.insert_one(invoice)
    
    # Seed integrations
    platforms = [
        {'platform': 'shopify', 'type': 'cms', 'name': 'Shopify'},
        {'platform': 'woocommerce', 'type': 'cms', 'name': 'WooCommerce'},
        {'platform': 'prestashop', 'type': 'cms', 'name': 'PrestaShop'},
        {'platform': 'amazon', 'type': 'marketplace', 'name': 'Amazon'},
        {'platform': 'zalando', 'type': 'marketplace', 'name': 'Zalando'},
    ]
    for client_id in client_ids[:3]:
        for p in platforms[:3]:
            db.integrations.insert_one({
                'client_id': client_id,
                'platform': p['platform'],
                'platform_type': p['type'],
                'store_name': f"Store {p['name']}",
                'status': 'active',
                'auto_sync_orders': True,
                'auto_sync_stock': True,
                'created_at': datetime.now(timezone.utc)
            })

# Initialize on startup
@app.on_event("startup")
async def startup_event():
    init_db()

# Health check
@app.get('/api/health')
def health_check():
    return {'status': 'healthy', 'database': 'mongodb'}

# ==================== AUTH ====================
class LoginRequest(BaseModel):
    username: str
    password: str

@app.post('/api/auth/login')
def login(data: LoginRequest):
    user = db.users.find_one({'username': data.username, 'active': True})
    if not user or not bcrypt.checkpw(data.password.encode(), user['password'].encode()):
        raise HTTPException(status_code=401, detail='Identifiants incorrects')
    
    client_name = None
    if user.get('client_id'):
        # Convert client_id to ObjectId for MongoDB query
        try:
            from bson import ObjectId
            client_id_obj = ObjectId(user['client_id']) if isinstance(user['client_id'], str) else user['client_id']
            client = db.clients.find_one({'_id': client_id_obj})
            client_name = client['name'] if client else None
        except:
            client_name = None
    
    token = create_token(user)
    return {
        'token': token,
        'user': {
            'id': str(user['_id']),
            'username': user['username'],
            'name': user['name'],
            'role': user['role'],
            'client_id': str(user['client_id']) if user.get('client_id') else None,
            'client_name': client_name
        }
    }

@app.get('/api/auth/me')
def get_me(request: Request):
    user = get_current_user(request)
    client_name = None
    if user.get('client_id'):
        client = db.clients.find_one({'_id': ObjectId(user['client_id'])})
        client_name = client['name'] if client else None
    user['client_name'] = client_name
    return user

# ==================== DASHBOARD ====================
@app.get('/api/dashboard/stats')
def get_dashboard_stats(request: Request, client_id: Optional[str] = None):
    user = get_current_user(request)
    
    # Build client filter
    if user['role'] == 'client':
        client_filter = {'client_id': user['client_id']}
    elif client_id:
        client_filter = {'client_id': client_id}
    else:
        client_filter = {}
    
    # Products and stock stats
    if client_filter:
        products_count = db.products.count_documents({**client_filter, 'active': True})
        
        # Calculate total stock
        pipeline = [
            {'$match': client_filter},
            {'$lookup': {'from': 'inventory', 'localField': '_id', 'foreignField': 'product_id', 'as': 'inv'}},
            {'$group': {'_id': None, 'total': {'$sum': {'$sum': '$inv.quantity'}}}}
        ]
        stock_result = list(db.products.aggregate(pipeline))
        total_stock = stock_result[0]['total'] if stock_result else 0
    else:
        # Admin viewing all: exclude demo clients
        non_demo_clients = list(db.clients.find(
            {'$or': [{'is_demo': {'$ne': True}}, {'is_demo': {'$exists': False}}]},
            {'_id': 1}
        ))
        non_demo_client_ids = [str(c['_id']) for c in non_demo_clients]
        
        products_count = db.products.count_documents({
            'active': True,
            'client_id': {'$in': non_demo_client_ids}
        })
        
        total_stock_result = list(db.inventory.aggregate([
            {'$lookup': {'from': 'products', 'localField': 'product_id', 'foreignField': '_id', 'as': 'product'}},
            {'$unwind': '$product'},
            {'$match': {'product.client_id': {'$in': non_demo_client_ids}}},
            {'$group': {'_id': None, 'total': {'$sum': '$quantity'}}}
        ]))
        total_stock = total_stock_result[0]['total'] if total_stock_result else 0
    
    # Orders stats
    if client_filter:
        orders_total = db.orders.count_documents(client_filter)
        orders_pending = db.orders.count_documents({**client_filter, 'status': 'pending'})
    else:
        # Admin: exclude demos
        orders_total = db.orders.count_documents({'client_id': {'$in': non_demo_client_ids}})
        orders_pending = db.orders.count_documents({'client_id': {'$in': non_demo_client_ids}, 'status': 'pending'})
    
    # Receipts stats
    if client_filter:
        receipts_pending = db.receipts.count_documents({**client_filter, 'status': {'$in': ['planned', 'in_progress']}})
    else:
        # Admin: exclude demos
        receipts_pending = db.receipts.count_documents({'client_id': {'$in': non_demo_client_ids}, 'status': {'$in': ['planned', 'in_progress']}})
    
    # Low stock products
    if client_filter:
        low_stock_pipeline = [
            {'$match': {**client_filter, 'active': True}},
            {'$lookup': {'from': 'inventory', 'localField': '_id', 'foreignField': 'product_id', 'as': 'inventory'}},
            {'$addFields': {'current_stock': {'$sum': '$inventory.quantity'}}},
            {'$match': {'$expr': {'$lt': ['$current_stock', '$min_stock_level']}}},
            {'$project': {'_id': 0, 'id': {'$toString': '$_id'}, 'sku': 1, 'name': 1, 'current_stock': 1, 'min_stock_level': 1}},
            {'$limit': 20}
        ]
    else:
        low_stock_pipeline = [
            {'$match': {'active': True}},
            {'$lookup': {'from': 'inventory', 'localField': '_id', 'foreignField': 'product_id', 'as': 'inventory'}},
            {'$addFields': {'current_stock': {'$sum': '$inventory.quantity'}}},
            {'$match': {'$expr': {'$lt': ['$current_stock', '$min_stock_level']}}},
            {'$project': {'_id': 0, 'id': {'$toString': '$_id'}, 'sku': 1, 'name': 1, 'current_stock': 1, 'min_stock_level': 1}},
            {'$limit': 20}
        ]
    
    low_stock_products = list(db.products.aggregate(low_stock_pipeline))
    
    return {
        'stock': {
            'total_products': products_count,
            'total_quantity': total_stock
        },
        'orders': {
            'total_orders': orders_total,
            'pending_orders': orders_pending
        },
        'receipts': {
            'pending_receipts': receipts_pending
        },
        'low_stock_products': low_stock_products
    }

# ==================== CLIENTS ====================
@app.get('/api/clients')
def get_clients(request: Request):
    user = get_current_user(request)
    if user['role'] != 'admin':
        raise HTTPException(status_code=403, detail='Accès non autorisé')
    clients = list(db.clients.find({'active': True}))
    return serialize_doc(clients)

class ClientCreate(BaseModel):
    code: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

@app.post('/api/clients')
def create_client(data: ClientCreate, request: Request):
    user = get_current_user(request)
    if user['role'] != 'admin':
        raise HTTPException(status_code=403, detail='Accès non autorisé')
    
    if db.clients.find_one({'code': data.code}):
        raise HTTPException(status_code=400, detail='Code client déjà utilisé')
    
    result = db.clients.insert_one({
        'code': data.code,
        'name': data.name,
        'email': data.email,
        'phone': data.phone,
        'address': data.address,
        'active': True,
        'created_at': datetime.now(timezone.utc)
    })
    return {'id': str(result.inserted_id), 'message': 'Client créé'}

# ==================== PRODUCTS ====================
@app.get('/api/products')
def get_products(request: Request, client_id: Optional[str] = None):
    user = get_current_user(request)
    
    query = {'active': True}
    if user['role'] == 'client':
        query['client_id'] = user['client_id']
    elif client_id:
        query['client_id'] = client_id
    else:
        # Admin without client_id: exclude demos
        non_demo_clients = list(db.clients.find(
            {'$or': [{'is_demo': {'$ne': True}}, {'is_demo': {'$exists': False}}]},
            {'_id': 1}
        ))
        non_demo_client_ids = [str(c['_id']) for c in non_demo_clients]
        if non_demo_client_ids:
            query['client_id'] = {'$in': non_demo_client_ids}
        else:
            query['client_id'] = None  # Return empty
    
    pipeline = [
        {'$match': query},
        {'$lookup': {'from': 'clients', 'localField': 'client_id', 'foreignField': '_id', 'as': 'client'}},
        {'$lookup': {'from': 'inventory', 'localField': '_id', 'foreignField': 'product_id', 'as': 'inventory'}},
        {'$addFields': {
            'client_name': {'$arrayElemAt': ['$client.name', 0]},
            'total_stock': {'$sum': '$inventory.quantity'}
        }},
        {'$project': {'client': 0, 'inventory': 0}},
        {'$sort': {'created_at': -1}},
        {'$limit': 200}
    ]
    
    products = list(db.products.aggregate(pipeline))
    return serialize_doc(products)

class ProductCreate(BaseModel):
    client_id: str
    sku: str
    name: str
    description: Optional[str] = None
    barcode: Optional[str] = None
    category: Optional[str] = None
    unit_weight: Optional[float] = None
    min_stock_level: Optional[int] = 0

@app.post('/api/products')
def create_product(data: ProductCreate, request: Request):
    user = get_current_user(request)
    
    if db.products.find_one({'client_id': ObjectId(data.client_id), 'sku': data.sku}):
        raise HTTPException(status_code=400, detail='SKU déjà utilisé pour ce client')
    
    result = db.products.insert_one({
        'client_id': ObjectId(data.client_id),
        'sku': data.sku,
        'name': data.name,
        'description': data.description,
        'barcode': data.barcode,
        'category': data.category,
        'unit_weight': data.unit_weight,
        'min_stock_level': data.min_stock_level or 0,
        'active': True,
        'created_at': datetime.now(timezone.utc)
    })
    return {'id': str(result.inserted_id), 'message': 'Produit créé'}

# ==================== INVENTORY ====================
@app.get('/api/inventory')
def get_inventory(request: Request, client_id: Optional[str] = None):
    user = get_current_user(request)
    
    # Build base pipeline
    pipeline = [
        {'$lookup': {'from': 'products', 'localField': 'product_id', 'foreignField': '_id', 'as': 'product'}},
        {'$unwind': '$product'},
    ]
    
    # Add client filter based on user role
    if user['role'] == 'client':
        pipeline.append({'$match': {'product.client_id': user['client_id']}})
    elif client_id:
        pipeline.append({'$match': {'product.client_id': client_id}})
    else:
        # Admin without client_id: exclude demos via lookup
        pipeline.extend([
            {'$lookup': {'from': 'clients', 'localField': 'product.client_id', 'foreignField': '_id', 'as': 'client_info'}},
            {'$match': {
                '$or': [
                    {'client_info.is_demo': {'$ne': True}},
                    {'client_info.is_demo': {'$exists': False}},
                    {'client_info': {'$size': 0}}
                ]
            }}
        ])
    
    # Continue pipeline
    pipeline.extend([
        {'$lookup': {'from': 'locations', 'localField': 'location_id', 'foreignField': '_id', 'as': 'location'}},
        {'$unwind': '$location'},
        {'$lookup': {'from': 'clients', 'localField': 'product.client_id', 'foreignField': '_id', 'as': 'client'}},
        {'$addFields': {
            'product_name': '$product.name',
            'product_sku': '$product.sku',
            'location_code': '$location.code',
            'client_name': {'$arrayElemAt': ['$client.name', 0]},
            'client_id': '$product.client_id'
        }},
        {'$project': {'product': 0, 'location': 0, 'client': 0, 'client_info': 0}},
        {'$limit': 500}
    ])
    
    inventory = list(db.inventory.aggregate(pipeline))
    return serialize_doc(inventory)

# ==================== ORDERS ====================
@app.get('/api/orders')
def get_orders(request: Request, client_id: Optional[str] = None, status: Optional[str] = None):
    user = get_current_user(request)
    
    query = {}
    if user['role'] == 'client':
        query['client_id'] = user['client_id']
    elif client_id:
        query['client_id'] = client_id
    else:
        # Admin without client_id: exclude demos
        non_demo_clients = list(db.clients.find(
            {'$or': [{'is_demo': {'$ne': True}}, {'is_demo': {'$exists': False}}]},
            {'_id': 1}
        ))
        non_demo_client_ids = [str(c['_id']) for c in non_demo_clients]
        if non_demo_client_ids:
            query['client_id'] = {'$in': non_demo_client_ids}
        else:
            query['client_id'] = None
    if status:
        query['status'] = status
    
    pipeline = [
        {'$match': query},
        {'$lookup': {'from': 'clients', 'localField': 'client_id', 'foreignField': '_id', 'as': 'client'}},
        {'$addFields': {'client_name': {'$arrayElemAt': ['$client.name', 0]}}},
        {'$project': {'client': 0}},
        {'$sort': {'created_at': -1}},
        {'$limit': 100}
    ]
    
    orders = list(db.orders.aggregate(pipeline))
    return serialize_doc(orders)

class OrderCreate(BaseModel):
    client_id: str
    customer_name: str
    customer_email: Optional[str] = None
    shipping_address: Optional[str] = None
    priority: Optional[str] = 'medium'

@app.post('/api/orders')
def create_order(data: OrderCreate, request: Request):
    user = get_current_user(request)
    
    count = db.orders.count_documents({})
    order_number = f'CMD-{str(count + 1).zfill(6)}'
    
    result = db.orders.insert_one({
        'order_number': order_number,
        'client_id': ObjectId(data.client_id),
        'customer_name': data.customer_name,
        'customer_email': data.customer_email,
        'shipping_address': data.shipping_address,
        'order_date': datetime.now(timezone.utc),
        'status': 'pending',
        'priority': data.priority or 'medium',
        'created_by': ObjectId(user['id']),
        'created_at': datetime.now(timezone.utc)
    })
    return {'id': str(result.inserted_id), 'order_number': order_number}

# ==================== RECEIPTS ====================
@app.get('/api/receipts')
def get_receipts(request: Request, client_id: Optional[str] = None, status: Optional[str] = None):
    user = get_current_user(request)
    
    query = {}
    if user['role'] == 'client':
        query['client_id'] = user['client_id']
    elif client_id:
        query['client_id'] = client_id
    else:
        # Admin without client_id: exclude demos
        non_demo_clients = list(db.clients.find(
            {'$or': [{'is_demo': {'$ne': True}}, {'is_demo': {'$exists': False}}]},
            {'_id': 1}
        ))
        non_demo_client_ids = [str(c['_id']) for c in non_demo_clients]
        if non_demo_client_ids:
            query['client_id'] = {'$in': non_demo_client_ids}
        else:
            query['client_id'] = None
    if status:
        query['status'] = status
    
    pipeline = [
        {'$match': query},
        {'$lookup': {'from': 'clients', 'localField': 'client_id', 'foreignField': '_id', 'as': 'client'}},
        {'$addFields': {'client_name': {'$arrayElemAt': ['$client.name', 0]}}},
        {'$project': {'client': 0}},
        {'$sort': {'created_at': -1}},
        {'$limit': 100}
    ]
    
    receipts = list(db.receipts.aggregate(pipeline))
    return serialize_doc(receipts)

class ReceiptCreate(BaseModel):
    client_id: str
    supplier_name: str
    expected_date: Optional[str] = None
    notes: Optional[str] = None

@app.post('/api/receipts')
def create_receipt(data: ReceiptCreate, request: Request):
    user = get_current_user(request)
    
    count = db.receipts.count_documents({})
    receipt_number = f'REC-{str(count + 1).zfill(6)}'
    
    result = db.receipts.insert_one({
        'receipt_number': receipt_number,
        'client_id': ObjectId(data.client_id),
        'supplier_name': data.supplier_name,
        'expected_date': datetime.fromisoformat(data.expected_date) if data.expected_date else None,
        'status': 'planned',
        'notes': data.notes,
        'created_by': ObjectId(user['id']),
        'created_at': datetime.now(timezone.utc)
    })
    return {'id': str(result.inserted_id), 'receipt_number': receipt_number}

# ==================== INVENTORY COUNTS ====================
@app.get('/api/inventory-counts')
def get_inventory_counts(request: Request, client_id: Optional[str] = None):
    user = get_current_user(request)
    
    query = {}
    if user['role'] == 'client':
        query['client_id'] = user['client_id']
    elif client_id:
        query['client_id'] = client_id
    
    counts = list(db.inventory_counts.find(query).sort('created_at', -1).limit(50))
    return serialize_doc(counts)

# ==================== BILLING / INVOICES ====================
@app.get('/api/billing/invoices')
def get_invoices(request: Request, client_id: Optional[str] = None):
    user = get_current_user(request)
    
    query = {}
    if user['role'] == 'client':
        query['client_id'] = user['client_id']
    elif client_id:
        query['client_id'] = client_id
    else:
        # Admin without client_id: exclude demos
        non_demo_clients = list(db.clients.find(
            {'$or': [{'is_demo': {'$ne': True}}, {'is_demo': {'$exists': False}}]},
            {'_id': 1}
        ))
        non_demo_client_ids = [str(c['_id']) for c in non_demo_clients]
        if non_demo_client_ids:
            query['client_id'] = {'$in': non_demo_client_ids}
        else:
            query['client_id'] = None
    
    pipeline = [
        {'$match': query},
        {'$lookup': {'from': 'clients', 'localField': 'client_id', 'foreignField': '_id', 'as': 'client'}},
        {'$addFields': {'client_name': {'$arrayElemAt': ['$client.name', 0]}}},
        {'$project': {'client': 0}},
        {'$sort': {'created_at': -1}},
        {'$limit': 50}
    ]
    
    invoices = list(db.invoices.aggregate(pipeline))
    return serialize_doc(invoices)

class InvoiceGenerate(BaseModel):
    client_id: str
    start_date: str
    end_date: str

@app.post('/api/billing/invoices/generate')
def generate_invoice(data: InvoiceGenerate, request: Request):
    user = get_current_user(request)
    if user['role'] != 'admin':
        raise HTTPException(status_code=403, detail='Accès non autorisé')
    
    client = db.clients.find_one({'_id': ObjectId(data.client_id)})
    if not client:
        raise HTTPException(status_code=404, detail='Client non trouvé')
    
    start = datetime.fromisoformat(data.start_date)
    end = datetime.fromisoformat(data.end_date)
    
    # Count activity
    orders_count = db.orders.count_documents({
        'client_id': ObjectId(data.client_id),
        'created_at': {'$gte': start, '$lte': end}
    })
    receipts_count = db.receipts.count_documents({
        'client_id': ObjectId(data.client_id),
        'created_at': {'$gte': start, '$lte': end}
    })
    
    # Calculate
    order_price = 2.50
    receipt_price = 5.00
    storage_fee = 150.00
    
    subtotal = (orders_count * order_price) + (receipts_count * receipt_price) + storage_fee
    tax_amount = subtotal * 0.2
    total = subtotal + tax_amount
    
    count = db.invoices.count_documents({})
    invoice_number = f'FACT-{datetime.now().strftime("%Y%m")}-{str(count + 1).zfill(4)}'
    
    result = db.invoices.insert_one({
        'invoice_number': invoice_number,
        'client_id': ObjectId(data.client_id),
        'billing_period_start': start,
        'billing_period_end': end,
        'issue_date': datetime.now(timezone.utc),
        'due_date': datetime.now(timezone.utc) + timedelta(days=30),
        'subtotal': subtotal,
        'tax_rate': 20,
        'tax_amount': tax_amount,
        'total': total,
        'status': 'draft',
        'created_by': ObjectId(user['id']),
        'created_at': datetime.now(timezone.utc)
    })
    
    # Insert invoice lines
    lines = [
        {'invoice_id': result.inserted_id, 'description': f'Préparation commandes ({orders_count})', 'quantity': orders_count, 'unit_price': order_price, 'total': orders_count * order_price},
        {'invoice_id': result.inserted_id, 'description': f'Réceptions ({receipts_count})', 'quantity': receipts_count, 'unit_price': receipt_price, 'total': receipts_count * receipt_price},
        {'invoice_id': result.inserted_id, 'description': 'Frais de stockage mensuel', 'quantity': 1, 'unit_price': storage_fee, 'total': storage_fee},
    ]
    db.invoice_lines.insert_many(lines)
    
    return {
        'id': str(result.inserted_id),
        'invoice_number': invoice_number,
        'total': total,
        'message': 'Facture générée'
    }

# ==================== INTEGRATIONS ====================
@app.get('/api/integrations')
def get_integrations(request: Request, client_id: Optional[str] = None):
    user = get_current_user(request)
    
    query = {}
    if user['role'] == 'client':
        query['client_id'] = user['client_id']
    elif client_id:
        query['client_id'] = client_id
    
    pipeline = [
        {'$match': query},
        {'$lookup': {'from': 'clients', 'localField': 'client_id', 'foreignField': '_id', 'as': 'client'}},
        {'$addFields': {'client_name': {'$arrayElemAt': ['$client.name', 0]}}},
        {'$project': {'client': 0}}
    ]
    
    integrations = list(db.integrations.aggregate(pipeline))
    return serialize_doc(integrations)

@app.get('/api/integrations/available')
def get_available_platforms(request: Request):
    get_current_user(request)
    return {
        'cms': [
            {'id': 'shopify', 'name': 'Shopify'},
            {'id': 'woocommerce', 'name': 'WooCommerce'},
            {'id': 'prestashop', 'name': 'PrestaShop'},
            {'id': 'magento', 'name': 'Magento'},
            {'id': 'bigcommerce', 'name': 'BigCommerce'}
        ],
        'marketplace': [
            {'id': 'amazon', 'name': 'Amazon'},
            {'id': 'zalando', 'name': 'Zalando'},
            {'id': 'cdiscount', 'name': 'Cdiscount'},
            {'id': 'tiktok_shop', 'name': 'TikTok Shop'},
            {'id': 'veepee', 'name': 'Veepee'},
            {'id': 'smallable', 'name': 'Smallable'},
            {'id': 'decathlon', 'name': 'Decathlon'},
            {'id': 'fnac_darty', 'name': 'Fnac Darty'},
            {'id': 'leroy_merlin', 'name': 'Leroy Merlin'},
            {'id': 'manomano', 'name': 'ManoMano'}
        ],
        'carrier': [
            {'id': 'chronopost', 'name': 'Chronopost'},
            {'id': 'colissimo', 'name': 'Colissimo'},
            {'id': 'gls', 'name': 'GLS'},
            {'id': 'dhl', 'name': 'DHL Express'},
            {'id': 'ups', 'name': 'UPS'},
            {'id': 'fedex', 'name': 'FedEx'},
            {'id': 'mondial_relay', 'name': 'Mondial Relay'},
            {'id': 'relais_colis', 'name': 'Relais Colis'},
            {'id': 'amazon_shipping', 'name': 'Amazon Shipping'},
            {'id': 'dpd', 'name': 'DPD'}
        ]
    }

@app.delete('/api/integrations/{integration_id}')
def delete_integration(integration_id: str, request: Request):
    user = get_current_user(request)
    db.integrations.delete_one({'_id': ObjectId(integration_id)})
    return {'message': 'Intégration supprimée'}

# ==================== CARRIERS ====================
@app.get('/api/carriers')
def get_carriers(request: Request):
    get_current_user(request)
    carriers = list(db.carriers.find({'active': True}))
    return serialize_doc(carriers)

# ==================== SHOPIFY INTEGRATION ====================
class ShopifyCredentials(BaseModel):
    integration_id: str
    store_url: str
    api_key: str
    api_secret: str
    access_token: str

class ShopifyOrderSync(BaseModel):
    integration_id: str

@app.post('/api/shopify/configure')
def configure_shopify(data: ShopifyCredentials, request: Request):
    get_current_user(request)
    db.integrations.update_one(
        {'_id': ObjectId(data.integration_id)},
        {'$set': {
            'api_key': data.api_key,
            'api_secret': data.api_secret,
            'access_token': data.access_token,
            'store_url': data.store_url,
            'status': 'active'
        }}
    )
    return {'success': True, 'message': 'Configuration Shopify enregistrée'}

@app.post('/api/shopify/sync-orders')
def sync_shopify_orders(data: ShopifyOrderSync, request: Request):
    user = get_current_user(request)
    
    integration = db.integrations.find_one({'_id': ObjectId(data.integration_id)})
    if not integration:
        raise HTTPException(status_code=404, detail='Intégration non trouvée')
    
    if not integration.get('access_token') or not integration.get('store_url'):
        raise HTTPException(status_code=400, detail='Configuration Shopify incomplète. Veuillez configurer les identifiants API.')
    
    try:
        store_url = integration['store_url'].replace('https://', '').replace('http://', '').rstrip('/')
        api_version = '2024-01'
        
        headers = {
            'X-Shopify-Access-Token': integration['access_token'],
            'Content-Type': 'application/json'
        }
        
        with httpx.Client(timeout=30.0) as client:
            response = client.get(
                f"https://{store_url}/admin/api/{api_version}/orders.json?status=any&limit=50",
                headers=headers
            )
            
            if response.status_code == 401:
                raise HTTPException(status_code=401, detail='Authentification Shopify échouée')
            
            response.raise_for_status()
            orders_data = response.json().get('orders', [])
        
        imported_count = 0
        for shop_order in orders_data:
            existing = db.orders.find_one({
                'external_order_id': str(shop_order['id']),
                'external_platform': 'shopify'
            })
            
            if not existing:
                count = db.orders.count_documents({})
                order_number = f"SHOP-{str(count + 1).zfill(6)}"
                
                shipping = shop_order.get('shipping_address', {})
                shipping_address = f"{shipping.get('address1', '')}, {shipping.get('city', '')} {shipping.get('zip', '')}, {shipping.get('country', '')}"
                
                db.orders.insert_one({
                    'order_number': order_number,
                    'client_id': integration['client_id'],
                    'customer_name': f"{shipping.get('first_name', '')} {shipping.get('last_name', '')}".strip() or 'Client Shopify',
                    'customer_email': shop_order.get('contact_email', ''),
                    'shipping_address': shipping_address,
                    'status': 'pending',
                    'priority': 'medium',
                    'external_order_id': str(shop_order['id']),
                    'external_platform': 'shopify',
                    'created_by': ObjectId(user['id']),
                    'created_at': datetime.now(timezone.utc)
                })
                imported_count += 1
        
        db.integrations.update_one(
            {'_id': ObjectId(data.integration_id)},
            {'$set': {'last_sync': datetime.now(timezone.utc)}}
        )
        
        return {
            'success': True,
            'ordersImported': imported_count,
            'totalOrdersFetched': len(orders_data),
            'message': f'{imported_count} nouvelles commandes importées de Shopify'
        }
        
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f'Erreur API Shopify: {str(e)}')

# ==================== CARRIER SHIPMENT ====================
class ShipmentCreate(BaseModel):
    order_id: str
    carrier: str
    service_type: Optional[str] = 'standard'
    weight: float

class CarrierCredentials(BaseModel):
    carrier: str
    client_id: str
    account_number: str
    api_key: str
    api_secret: Optional[str] = None

@app.post('/api/carriers/configure')
def configure_carrier(data: CarrierCredentials, request: Request):
    get_current_user(request)
    
    carrier = db.carriers.find_one({'code': data.carrier.upper()})
    if not carrier:
        raise HTTPException(status_code=404, detail='Transporteur non trouvé')
    
    db.carriers.update_one(
        {'code': data.carrier.upper()},
        {'$set': {'api_key': data.api_key, 'api_secret': data.api_secret}}
    )
    
    return {'success': True, 'message': f'Configuration {data.carrier} enregistrée'}

@app.post('/api/carriers/create-shipment')
def create_carrier_shipment(data: ShipmentCreate, request: Request):
    user = get_current_user(request)
    
    order = db.orders.find_one({'_id': ObjectId(data.order_id)})
    if not order:
        raise HTTPException(status_code=404, detail='Commande non trouvée')
    
    carrier = db.carriers.find_one({'code': data.carrier.upper()})
    if not carrier:
        raise HTTPException(status_code=404, detail='Transporteur non trouvé')
    
    # Demo mode - generate mock tracking number
    import random
    prefix_map = {'COLISSIMO': '6A', 'CHRONOPOST': 'XY'}
    prefix = prefix_map.get(data.carrier.upper(), 'TK')
    tracking_number = f"{prefix}{random.randint(100000000, 999999999)}FR"
    
    db.orders.update_one(
        {'_id': ObjectId(data.order_id)},
        {'$set': {'tracking_number': tracking_number, 'status': 'shipped'}}
    )
    
    tracking_url = carrier.get('tracking_url_template', '').replace('{tracking}', tracking_number) if carrier.get('tracking_url_template') else None
    
    return {
        'success': True,
        'mode': 'demo',
        'trackingNumber': tracking_number,
        'trackingUrl': tracking_url,
        'message': f'[MODE DEMO] Numéro de suivi généré: {tracking_number}'
    }

@app.get('/api/carriers/rates')
def get_shipping_rates(request: Request, from_zip: str = '75001', to_zip: str = '69001', weight: float = 1.0, carrier: Optional[str] = None):
    get_current_user(request)
    
    rates = []
    if not carrier or carrier.upper() == 'COLISSIMO':
        base_colissimo = 4.95 + (weight * 0.5)
        rates.extend([
            {'carrier': 'Colissimo', 'service': 'Standard', 'price': round(base_colissimo, 2), 'currency': 'EUR', 'estimatedDays': '2-3 jours', 'tracking': True},
            {'carrier': 'Colissimo', 'service': 'Signature', 'price': round(base_colissimo + 1.50, 2), 'currency': 'EUR', 'estimatedDays': '2-3 jours', 'tracking': True}
        ])
    
    if not carrier or carrier.upper() == 'CHRONOPOST':
        base_chrono = 9.90 + (weight * 1.2)
        rates.extend([
            {'carrier': 'Chronopost', 'service': 'Chrono 13', 'price': round(base_chrono, 2), 'currency': 'EUR', 'estimatedDays': '1 jour (avant 13h)', 'tracking': True},
            {'carrier': 'Chronopost', 'service': 'Chrono 18', 'price': round(base_chrono * 0.85, 2), 'currency': 'EUR', 'estimatedDays': '1 jour (avant 18h)', 'tracking': True}
        ])
    
    return {'fromZip': from_zip, 'toZip': to_zip, 'weight': weight, 'rates': rates}

# ==================== NOTIFICATIONS ====================
@app.get('/api/notifications/history')
def get_notification_history(request: Request, limit: int = 50):
    user = get_current_user(request)
    
    notifications = list(db.email_notifications.find().sort('created_at', -1).limit(limit))
    return serialize_doc(notifications)

@app.get('/api/notifications/settings')
def get_notification_settings(request: Request, client_id: Optional[str] = None):
    user = get_current_user(request)
    
    query = {}
    if user['role'] == 'client':
        query['client_id'] = user['client_id']
    elif client_id:
        query['client_id'] = client_id
    
    settings = list(db.notification_settings.find(query))
    return serialize_doc(settings)

# ==================== LOCATIONS ====================
@app.get('/api/locations')
def get_locations(request: Request):
    get_current_user(request)
    
    pipeline = [
        {'$lookup': {'from': 'warehouse_zones', 'localField': 'zone_id', 'foreignField': '_id', 'as': 'zone'}},
        {'$addFields': {'zone_name': {'$arrayElemAt': ['$zone.name', 0]}}},
        {'$project': {'zone': 0}},
        {'$limit': 200}
    ]
    
    locations = list(db.locations.aggregate(pipeline))
    return serialize_doc(locations)

@app.get('/api/warehouse-zones')
def get_warehouse_zones(request: Request):
    get_current_user(request)
    zones = list(db.warehouse_zones.find({'active': True}))
    return serialize_doc(zones)

# ============================================================================
# NOUVEAUX ENDPOINTS À AJOUTER AU FICHIER server.py
# Copiez ces endpoints dans votre fichier server.py existant
# ============================================================================

# ============================================================================
# 1. GESTION CLIENTS - Création et modification
# ============================================================================

from pydantic import BaseModel, EmailStr
from typing import Optional

class ClientCreate(BaseModel):
    name: str
    company_name: str
    email: EmailStr
    phone: Optional[str] = None
    address: str
    city: str
    postal_code: str
    country: str = "France"
    siren: str  # Numéro SIREN
    contact_first_name: str
    contact_last_name: str
    contact_email: EmailStr
    contact_phone: str

@app.post("/api/clients/create")
async def create_client(client_data: ClientCreate, request: Request):
    """Créer un nouveau client (Admin uniquement)"""
    # Vérifier que l'utilisateur est admin
    # (Ajoutez votre logique d'authentification ici)
    
    # Créer le code client automatiquement
    client_count = db.clients.count_documents({})
    client_code = f"CLI{str(client_count + 1).zfill(3)}"
    
    # Créer le client
    new_client = {
        "code": client_code,
        "name": client_data.company_name,
        "company_name": client_data.company_name,
        "email": client_data.email,
        "phone": client_data.phone,
        "address": client_data.address,
        "city": client_data.city,
        "postal_code": client_data.postal_code,
        "country": client_data.country,
        "siren": client_data.siren,
        "contact": {
            "first_name": client_data.contact_first_name,
            "last_name": client_data.contact_last_name,
            "email": client_data.contact_email,
            "phone": client_data.contact_phone
        },
        "active": True,
        "created_at": datetime.now(timezone.utc)
    }
    
    result = db.clients.insert_one(new_client)
    
    # Créer un compte utilisateur pour ce client
    username = client_data.company_name.lower().replace(" ", "")
    default_password = bcrypt.hashpw("Client2024".encode('utf-8'), bcrypt.gensalt())
    
    user = {
        "username": username,
        "password": default_password.decode('utf-8'),
        "name": f"{client_data.contact_first_name} {client_data.contact_last_name}",
        "email": client_data.contact_email,
        "role": "client",
        "client_id": str(result.inserted_id),
        "active": True,
        "created_at": datetime.now(timezone.utc)
    }
    
    db.users.insert_one(user)
    
    return {
        "success": True,
        "client_id": str(result.inserted_id),
        "client_code": client_code,
        "username": username,
        "default_password": "Client2024",
        "message": "Client créé avec succès. Envoyez les identifiants au client."
    }

@app.put("/api/clients/{client_id}")
async def update_client(client_id: str, client_data: ClientCreate, request: Request):
    """Mettre à jour un client"""
    
    update_data = {
        "name": client_data.company_name,
        "company_name": client_data.company_name,
        "email": client_data.email,
        "phone": client_data.phone,
        "address": client_data.address,
        "city": client_data.city,
        "postal_code": client_data.postal_code,
        "country": client_data.country,
        "siren": client_data.siren,
        "contact": {
            "first_name": client_data.contact_first_name,
            "last_name": client_data.contact_last_name,
            "email": client_data.contact_email,
            "phone": client_data.contact_phone
        },
        "updated_at": datetime.now(timezone.utc)
    }
    
    result = db.clients.update_one(
        {"_id": ObjectId(client_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    
    return {"success": True, "message": "Client mis à jour"}

# ============================================================================
# 2. PRODUITS - Ajout du poids et modification
# ============================================================================

class ProductUpdate(BaseModel):
    sku: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    weight: Optional[int] = 0  # Poids en grammes
    min_stock_level: Optional[int] = None

@app.put("/api/products/{product_id}")
async def update_product(product_id: str, product_data: ProductUpdate, request: Request):
    """Mettre à jour un produit"""
    
    update_fields = {}
    if product_data.sku is not None:
        update_fields["sku"] = product_data.sku
    if product_data.name is not None:
        update_fields["name"] = product_data.name
    if product_data.description is not None:
        update_fields["description"] = product_data.description
    if product_data.category is not None:
        update_fields["category"] = product_data.category
    if product_data.weight is not None:
        update_fields["weight"] = product_data.weight
    if product_data.min_stock_level is not None:
        update_fields["min_stock_level"] = product_data.min_stock_level
    
    update_fields["updated_at"] = datetime.now(timezone.utc)
    
    result = db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": update_fields}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    return {"success": True, "message": "Produit mis à jour"}

# ============================================================================
# 3. RÉCEPTIONS - Création manuelle et détails
# ============================================================================

class ReceiptCreate(BaseModel):
    client_id: str
    supplier_name: str
    expected_date: str
    notes: Optional[str] = None
    products: list  # [{product_id, expected_quantity, lot_number, expiry_date}]

@app.post("/api/receipts/create")
async def create_receipt(receipt_data: ReceiptCreate, request: Request):
    """Créer une nouvelle réception"""
    
    # Générer le numéro de réception
    receipt_count = db.receipts.count_documents({})
    receipt_number = f"REC-{str(receipt_count + 1).zfill(6)}"
    
    new_receipt = {
        "receipt_number": receipt_number,
        "client_id": receipt_data.client_id,
        "supplier_name": receipt_data.supplier_name,
        "expected_date": receipt_data.expected_date,
        "received_date": None,
        "status": "planned",  # planned, in_progress, completed
        "notes": receipt_data.notes,
        "created_at": datetime.now(timezone.utc)
    }
    
    result = db.receipts.insert_one(new_receipt)
    receipt_id = str(result.inserted_id)
    
    # Créer les lignes de réception
    for product in receipt_data.products:
        receipt_line = {
            "receipt_id": receipt_id,
            "product_id": product["product_id"],
            "expected_quantity": product["expected_quantity"],
            "received_quantity": 0,
            "lot_number": product.get("lot_number"),
            "expiry_date": product.get("expiry_date"),
            "location_id": None
        }
        db.receipt_lines.insert_one(receipt_line)
    
    return {
        "success": True,
        "receipt_id": receipt_id,
        "receipt_number": receipt_number,
        "message": "Réception créée avec succès"
    }

@app.get("/api/receipts/{receipt_id}/details")
async def get_receipt_details(receipt_id: str, request: Request):
    """Obtenir les détails complets d'une réception"""
    
    # Récupérer la réception
    receipt = db.receipts.find_one({"_id": ObjectId(receipt_id)})
    if not receipt:
        raise HTTPException(status_code=404, detail="Réception non trouvée")
    
    # Récupérer les lignes de réception
    lines = list(db.receipt_lines.aggregate([
        {"$match": {"receipt_id": receipt_id}},
        {
            "$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product"
            }
        },
        {"$unwind": "$product"}
    ]))
    
    # Calculer le poids total
    total_weight = sum(
        line["received_quantity"] * line["product"].get("weight", 0)
        for line in lines
    )
    
    # Récupérer le client
    client = db.clients.find_one({"_id": ObjectId(receipt["client_id"])})
    
    return {
        "receipt": serialize_doc(receipt),
        "client": serialize_doc(client),
        "lines": serialize_doc(lines),
        "total_weight": total_weight,
        "total_products": sum(line["received_quantity"] for line in lines)
    }

# ============================================================================
# 4. COMMANDES - Création manuelle et détails complets
# ============================================================================

class OrderCreate(BaseModel):
    client_id: str
    customer_name: str
    customer_email: str
    shipping_address: str
    products: list  # [{product_id, quantity}]
    priority: str = "medium"
    notes: Optional[str] = None

@app.post("/api/orders/create")
async def create_order(order_data: OrderCreate, request: Request):
    """Créer une nouvelle commande manuellement"""
    
    # Générer le numéro de commande
    order_count = db.orders.count_documents({})
    order_number = f"CMD-{str(order_count + 1).zfill(6)}"
    
    new_order = {
        "order_number": order_number,
        "client_id": order_data.client_id,
        "customer_name": order_data.customer_name,
        "customer_email": order_data.customer_email,
        "shipping_address": order_data.shipping_address,
        "order_date": datetime.now(timezone.utc).isoformat(),
        "due_date": None,
        "status": "pending",  # pending, picking, packed, shipped
        "priority": order_data.priority,
        "tracking_number": None,
        "notes": order_data.notes,
        "external_platform": "manual",  # Créée manuellement
        "preparation_date": None,
        "pickup_date": None,
        "created_at": datetime.now(timezone.utc)
    }
    
    result = db.orders.insert_one(new_order)
    order_id = str(result.inserted_id)
    
    # Créer les lignes de commande
    for product in order_data.products:
        order_line = {
            "order_id": order_id,
            "product_id": product["product_id"],
            "quantity_ordered": product["quantity"],
            "quantity_picked": 0
        }
        db.order_lines.insert_one(order_line)
    
    return {
        "success": True,
        "order_id": order_id,
        "order_number": order_number,
        "message": "Commande créée avec succès"
    }

@app.get("/api/orders/{order_id}/details")
async def get_order_details(order_id: str, request: Request):
    """Obtenir les détails complets d'une commande"""
    
    # Récupérer la commande
    order = db.orders.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    
    # Récupérer les lignes de commande avec produits
    lines = list(db.order_lines.aggregate([
        {"$match": {"order_id": order_id}},
        {
            "$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product"
            }
        },
        {"$unwind": "$product"}
    ]))
    
    # Calculer le poids total
    total_weight = sum(
        line["quantity_ordered"] * line["product"].get("weight", 0)
        for line in lines
    )
    
    # Nombre total de produits
    total_products = sum(line["quantity_ordered"] for line in lines)
    
    # Récupérer le client
    client = db.clients.find_one({"_id": ObjectId(order["client_id"])})
    
    return {
        "order": serialize_doc(order),
        "client": serialize_doc(client),
        "lines": serialize_doc(lines),
        "total_weight": total_weight,
        "total_products": total_products,
        "order_date": order.get("order_date"),
        "preparation_date": order.get("preparation_date"),
        "pickup_date": order.get("pickup_date"),
        "platform": order.get("external_platform", "manual")
    }

@app.put("/api/orders/{order_id}/update-dates")
async def update_order_dates(
    order_id: str,
    preparation_date: Optional[str] = None,
    pickup_date: Optional[str] = None,
    request: Request = None
):
    """Mettre à jour les dates de préparation et récupération"""
    
    update_fields = {}
    if preparation_date:
        update_fields["preparation_date"] = preparation_date
    if pickup_date:
        update_fields["pickup_date"] = pickup_date
    
    if not update_fields:
        raise HTTPException(status_code=400, detail="Aucune date fournie")
    
    result = db.orders.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": update_fields}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    
    return {"success": True, "message": "Dates mises à jour"}

# ============================================================================
# ENDPOINT API - CHANGEMENT DE MOT DE PASSE
# À AJOUTER dans backend/server.py
# ============================================================================

from pydantic import BaseModel
import bcrypt

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

@app.post("/api/users/change-password")
async def change_password(password_data: dict, request: Request):
    """Changer le mot de passe de l'utilisateur connecté"""
    
    try:
        import bcrypt
        
        current_password = password_data.get("current_password")
        new_password = password_data.get("new_password")
        
        if not current_password or not new_password:
            raise HTTPException(status_code=400, detail="Mots de passe requis")
        
        # Récupérer l'utilisateur (temporairement on utilise l'admin)
        username = request.headers.get("X-Username")
        if username:
            user = db.users.find_one({"username": username})
        else:
            user = db.users.find_one({"username": "admin"})
        
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        
        # Vérifier l'ancien mot de passe
        if not bcrypt.checkpw(current_password.encode('utf-8'), user["password"].encode('utf-8')):
            raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect")
        
        # Valider le nouveau mot de passe
        if len(new_password) < 8:
            raise HTTPException(status_code=400, detail="Le nouveau mot de passe doit contenir au moins 8 caractères")
        
        # Hasher le nouveau mot de passe
        new_hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        
        # Mettre à jour le mot de passe
        result = db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"password": new_hashed_password.decode('utf-8')}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour")
        
        return {
            "success": True,
            "message": "Mot de passe changé avec succès"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erreur changement mot de passe: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/users/profile")
async def get_user_profile(request: Request):
    """Récupérer le profil de l'utilisateur connecté"""
    
    try:
        # SOLUTION TEMPORAIRE : Récupérer l'utilisateur depuis le username dans les headers
        # ou retourner l'admin par défaut
        
        username = request.headers.get("X-Username")
        
        if username:
            user = db.users.find_one({"username": username})
        else:
            # Par défaut, retourner l'utilisateur admin
            user = db.users.find_one({"username": "admin"})
        
        if not user:
            # Si vraiment aucun utilisateur, retourner l'admin par défaut
            user = db.users.find_one({"role": "admin"})
        
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        
        # Ne pas renvoyer le mot de passe
        user_data = {
            "id": str(user["_id"]),
            "username": user.get("username"),
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user.get("role"),
            "client_id": user.get("client_id")
        }
        
        return user_data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erreur récupération profil: {e}")
        raise HTTPException(status_code=500, detail="Erreur serveur")


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8001)
