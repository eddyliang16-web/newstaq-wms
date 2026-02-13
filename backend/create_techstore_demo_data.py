"""
Script pour créer des données de démo pour le compte TechStore
À exécuter sur Render Shell ou en local
"""

from pymongo import MongoClient
from datetime import datetime, timedelta
import random
import os

# Configuration
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'wms_database')

# Connexion MongoDB
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

print("🚀 Création des données de démo pour TechStore...")

# 1. Récupérer le client TechStore
techstore = db.clients.find_one({"code": "techstore"}) or db.clients.find_one({"name": {"$regex": "techstore", "$options": "i"}})

if not techstore:
    print("❌ Client TechStore non trouvé. Création...")
    # Créer TechStore si n'existe pas
    techstore_id = db.clients.insert_one({
        "code": "techstore",
        "name": "TechStore",
        "email": "contact@techstore.com",
        "phone": "+33 1 45 67 89 12",
        "address": "15 Avenue de la Technologie",
        "city": "Paris",
        "postal_code": "75015",
        "country": "France",
        "siren": "123456789",
        "contact": {
            "first_name": "Jean",
            "last_name": "Martin",
            "email": "jean.martin@techstore.com",
            "phone": "+33 6 12 34 56 78"
        },
        "active": True
    }).inserted_id
    techstore = db.clients.find_one({"_id": techstore_id})
    print("✅ Client TechStore créé")
else:
    print(f"✅ Client TechStore trouvé : {techstore['_id']}")

client_id = str(techstore['_id'])

# 2. CRÉER DES PRODUITS RÉALISTES
print("\n📦 Création des produits...")

products_data = [
    # Smartphones
    {"sku": "TECH-IPHONE15", "name": "iPhone 15 Pro 256GB", "category": "Smartphones", "weight": 187, "price": 1299, "min_stock": 10},
    {"sku": "TECH-SAMSUNG-S24", "name": "Samsung Galaxy S24 Ultra", "category": "Smartphones", "weight": 232, "price": 1199, "min_stock": 10},
    {"sku": "TECH-PIXEL8", "name": "Google Pixel 8 Pro", "category": "Smartphones", "weight": 213, "price": 999, "min_stock": 5},
    
    # Laptops
    {"sku": "TECH-MACBOOK-PRO", "name": "MacBook Pro 14 M3", "category": "Laptops", "weight": 1550, "price": 2199, "min_stock": 5},
    {"sku": "TECH-DELL-XPS", "name": "Dell XPS 15", "category": "Laptops", "weight": 1800, "price": 1799, "min_stock": 5},
    {"sku": "TECH-LENOVO-THINKPAD", "name": "Lenovo ThinkPad X1 Carbon", "category": "Laptops", "weight": 1120, "price": 1599, "min_stock": 5},
    
    # Accessoires
    {"sku": "TECH-AIRPODS-PRO", "name": "AirPods Pro 2", "category": "Audio", "weight": 50, "price": 279, "min_stock": 20},
    {"sku": "TECH-MOUSE-LOGITECH", "name": "Logitech MX Master 3S", "category": "Accessoires", "weight": 141, "price": 99, "min_stock": 15},
    {"sku": "TECH-KEYBOARD-MECHANICAL", "name": "Clavier Mécanique RGB", "category": "Accessoires", "weight": 850, "price": 149, "min_stock": 10},
    {"sku": "TECH-WEBCAM-4K", "name": "Webcam 4K Logitech", "category": "Accessoires", "weight": 295, "price": 179, "min_stock": 8},
    
    # Tablettes
    {"sku": "TECH-IPAD-PRO", "name": "iPad Pro 12.9 M2", "category": "Tablettes", "weight": 682, "price": 1199, "min_stock": 8},
    {"sku": "TECH-SURFACE-PRO", "name": "Microsoft Surface Pro 9", "category": "Tablettes", "weight": 879, "price": 1099, "min_stock": 5},
    
    # Écrans
    {"sku": "TECH-MONITOR-4K", "name": "Écran 27 4K Dell", "category": "Moniteurs", "weight": 5200, "price": 449, "min_stock": 5},
    {"sku": "TECH-MONITOR-ULTRAWIDE", "name": "Écran 34 Ultrawide LG", "category": "Moniteurs", "weight": 7800, "price": 799, "min_stock": 3},
    
    # Stockage
    {"sku": "TECH-SSD-1TB", "name": "SSD Samsung 1TB", "category": "Stockage", "weight": 50, "price": 89, "min_stock": 20},
    {"sku": "TECH-HDD-4TB", "name": "Disque Dur Externe 4TB", "category": "Stockage", "weight": 230, "price": 109, "min_stock": 15},
]

product_ids = []
for prod in products_data:
    # Vérifier si le produit existe déjà
    existing = db.products.find_one({"sku": prod["sku"], "client_id": client_id})
    if existing:
        product_ids.append(str(existing['_id']))
        print(f"  ⏭️  {prod['name']} existe déjà")
    else:
        result = db.products.insert_one({
            "sku": prod["sku"],
            "name": prod["name"],
            "description": f"Produit high-tech - {prod['name']}",
            "category": prod["category"],
            "weight": prod["weight"],
            "min_stock_level": prod["min_stock"],
            "client_id": client_id,
            "active": True,
            "total_stock": random.randint(prod["min_stock"] + 5, prod["min_stock"] + 50)
        })
        product_ids.append(str(result.inserted_id))
        print(f"  ✅ {prod['name']} créé")

print(f"\n✅ {len(product_ids)} produits au total")

# 3. CRÉER DES COMMANDES RÉALISTES
print("\n📋 Création des commandes...")

order_count = 0
statuses = ['pending', 'picking', 'packed', 'shipped']
priorities = ['low', 'medium', 'high', 'urgent']
platforms = ['shopify', 'woocommerce', 'amazon', 'manual', 'ebay']

# Créer 15 commandes sur les 30 derniers jours
for i in range(15):
    days_ago = random.randint(0, 30)
    order_date = datetime.now() - timedelta(days=days_ago)
    
    # Sélectionner 1-4 produits aléatoires
    num_products = random.randint(1, 4)
    selected_products = random.sample(product_ids, num_products)
    
    order_number = f"CMD-TECH-{str(100 + i).zfill(4)}"
    
    order = {
        "order_number": order_number,
        "client_id": client_id,
        "customer_name": random.choice([
            "Sophie Dubois", "Marc Leroy", "Julie Bernard", "Pierre Moreau",
            "Emma Petit", "Lucas Simon", "Chloé Laurent", "Hugo Roux"
        ]),
        "customer_email": f"client{i}@example.com",
        "shipping_address": f"{random.randint(1, 999)} rue de la Tech, {random.choice(['75001', '75008', '75015', '92100', '69001'])} {random.choice(['Paris', 'Lyon', 'Marseille'])}",
        "order_date": order_date.isoformat(),
        "status": random.choice(statuses),
        "priority": random.choice(priorities),
        "external_platform": random.choice(platforms),
        "notes": random.choice(["Livraison urgente", "Client VIP", "Emballage cadeau demandé", "", ""]),
        "created_at": order_date
    }
    
    # Dates de préparation et récupération si commandée il y a plus de 2 jours
    if days_ago > 2 and order["status"] != "pending":
        order["preparation_date"] = (order_date + timedelta(hours=random.randint(4, 24))).isoformat()
    
    if days_ago > 3 and order["status"] in ["packed", "shipped"]:
        order["pickup_date"] = (order_date + timedelta(days=random.randint(1, 3))).isoformat()
    
    if order["status"] == "shipped":
        order["tracking_number"] = f"FR{random.randint(100000000, 999999999)}"
    
    result = db.orders.insert_one(order)
    order_id = str(result.inserted_id)
    
    # Créer les lignes de commande
    for prod_id in selected_products:
        db.order_lines.insert_one({
            "order_id": order_id,
            "product_id": prod_id,
            "quantity_ordered": random.randint(1, 5),
            "quantity_picked": random.randint(0, 5) if order["status"] != "pending" else 0
        })
    
    order_count += 1
    print(f"  ✅ Commande {order_number} créée ({order['status']})")

print(f"\n✅ {order_count} commandes créées")

# 4. CRÉER DES RÉCEPTIONS
print("\n📥 Création des réceptions...")

receipt_count = 0
for i in range(8):
    days_ago = random.randint(5, 45)
    expected_date = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")
    received_date = None
    status = random.choice(["planned", "in_progress", "completed"])
    
    if status == "completed":
        received_date = (datetime.now() - timedelta(days=days_ago - random.randint(1, 3))).isoformat()
    
    receipt_number = f"REC-TECH-{str(1000 + i).zfill(4)}"
    
    receipt = {
        "receipt_number": receipt_number,
        "client_id": client_id,
        "supplier_name": random.choice([
            "Fournisseur Tech Asie",
            "Import Electronic EU",
            "TechSupply France",
            "Global Electronics"
        ]),
        "expected_date": expected_date,
        "received_date": received_date,
        "status": status,
        "notes": random.choice(["Arrivage prévu matin", "Contrôle qualité requis", "", ""]),
        "created_at": datetime.now() - timedelta(days=days_ago + random.randint(1, 5))
    }
    
    result = db.receipts.insert_one(receipt)
    receipt_id = str(result.inserted_id)
    
    # Créer les lignes de réception
    num_products = random.randint(2, 5)
    for prod_id in random.sample(product_ids, num_products):
        expected_qty = random.randint(10, 100)
        db.receipt_lines.insert_one({
            "receipt_id": receipt_id,
            "product_id": prod_id,
            "expected_quantity": expected_qty,
            "received_quantity": expected_qty if status == "completed" else random.randint(0, expected_qty),
            "lot_number": f"LOT{random.randint(1000, 9999)}" if status == "completed" else None,
            "location_id": None
        })
    
    receipt_count += 1
    print(f"  ✅ Réception {receipt_number} créée ({status})")

print(f"\n✅ {receipt_count} réceptions créées")

# 5. CRÉER DES FACTURES
print("\n💰 Création des factures...")

invoice_count = 0
for i in range(6):
    days_ago = random.randint(0, 90)
    invoice_date = datetime.now() - timedelta(days=days_ago)
    
    amount = round(random.uniform(500, 5000), 2)
    
    invoice = {
        "invoice_number": f"FACT-TECH-{str(2024000 + i)}",
        "client_id": client_id,
        "invoice_date": invoice_date.isoformat(),
        "due_date": (invoice_date + timedelta(days=30)).isoformat(),
        "amount": amount,
        "status": random.choice(["paid", "pending", "overdue"]),
        "items": [
            {"description": "Services de stockage", "quantity": 1, "unit_price": amount * 0.4},
            {"description": "Préparation de commandes", "quantity": random.randint(10, 50), "unit_price": amount * 0.6 / random.randint(10, 50)},
        ],
        "created_at": invoice_date
    }
    
    db.invoices.insert_one(invoice)
    invoice_count += 1
    print(f"  ✅ Facture {invoice['invoice_number']} créée ({invoice['status']})")

print(f"\n✅ {invoice_count} factures créées")

# RÉSUMÉ
print("\n" + "="*60)
print("🎉 DONNÉES DE DÉMO CRÉÉES AVEC SUCCÈS !")
print("="*60)
print(f"Client : TechStore")
print(f"📦 Produits : {len(product_ids)}")
print(f"📋 Commandes : {order_count}")
print(f"📥 Réceptions : {receipt_count}")
print(f"💰 Factures : {invoice_count}")
print("\n✅ Le compte techstore/client123 est maintenant prêt pour une démo !")
print("="*60)

client.close()
