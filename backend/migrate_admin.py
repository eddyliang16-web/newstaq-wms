"""
Script de migration pour NEWSTAQ WMS
- Crée un compte admin réel (sans données de démo)
- Ajoute le champ 'weight' (poids en grammes) aux produits existants
- Nettoie les données de démo
"""

from pymongo import MongoClient
import bcrypt
import os

# Configuration
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'wms_database')

# Connexion MongoDB
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

print("🚀 Démarrage de la migration...")

# 1. CRÉER LE COMPTE ADMIN RÉEL
print("\n1️⃣ Création du compte administrateur réel...")

# Supprimer l'ancien admin de démo
db.users.delete_one({"username": "admin"})
print("   ✅ Ancien compte admin supprimé")

# Créer le nouveau compte admin
admin_password = bcrypt.hashpw("Admin2024!Secure".encode('utf-8'), bcrypt.gensalt())
admin_user = {
    "username": "admin",
    "password": admin_password.decode('utf-8'),
    "name": "Administrateur",
    "email": "admin@newstaq.com",
    "role": "admin",
    "client_id": None,
    "active": True
}
db.users.insert_one(admin_user)
print("   ✅ Nouveau compte admin créé")
print("      Username: admin")
print("      Password: Admin2024!Secure")
print("      ⚠️  CHANGEZ CE MOT DE PASSE après la première connexion !")

# 2. AJOUTER LE CHAMP POIDS AUX PRODUITS
print("\n2️⃣ Ajout du champ 'weight' aux produits...")

# Ajouter weight=0 aux produits qui n'en ont pas
result = db.products.update_many(
    {"weight": {"$exists": False}},
    {"$set": {"weight": 0}}
)
print(f"   ✅ {result.modified_count} produits mis à jour avec weight=0")

# 3. NETTOYER LES DONNÉES DE DÉMO (optionnel)
print("\n3️⃣ Nettoyage des données de démo...")

response = input("   Voulez-vous supprimer TOUS les clients de démo et leurs données ? (oui/non): ")

if response.lower() in ['oui', 'yes', 'y', 'o']:
    # Récupérer tous les client_ids de démo
    demo_clients = list(db.clients.find({}))
    demo_client_ids = [str(c['_id']) for c in demo_clients]
    
    if demo_client_ids:
        # Supprimer les données liées
        db.products.delete_many({"client_id": {"$in": demo_client_ids}})
        db.orders.delete_many({"client_id": {"$in": demo_client_ids}})
        db.receipts.delete_many({"client_id": {"$in": demo_client_ids}})
        db.invoices.delete_many({"client_id": {"$in": demo_client_ids}})
        db.users.delete_many({"client_id": {"$in": demo_client_ids}})
        
        # Supprimer les clients
        db.clients.delete_many({})
        
        print(f"   ✅ {len(demo_client_ids)} clients de démo et toutes leurs données supprimés")
    else:
        print("   ℹ️  Aucun client de démo trouvé")
else:
    print("   ℹ️  Données de démo conservées")

# 4. VÉRIFICATIONS
print("\n4️⃣ Vérifications...")

admin_count = db.users.count_documents({"role": "admin"})
client_count = db.clients.count_documents({})
product_count = db.products.count_documents({})

print(f"   📊 Comptes admin: {admin_count}")
print(f"   📊 Clients: {client_count}")
print(f"   📊 Produits: {product_count}")

print("\n✅ Migration terminée avec succès !")
print("\n🔐 INFORMATIONS DE CONNEXION:")
print("   URL: https://newstaq-frontend.onrender.com/login")
print("   Username: admin")
print("   Password: Admin2024!Secure")
print("   ⚠️  IMPORTANT: Changez ce mot de passe immédiatement !")

client.close()
