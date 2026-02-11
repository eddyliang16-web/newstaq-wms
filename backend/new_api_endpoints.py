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
