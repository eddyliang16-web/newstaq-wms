from pymongo import MongoClient
import sys

# REMPLACEZ par votre vraie URL MongoDB
MONGO_URL = "mongodb+srv://wmsuser:VotreMOtDePasse@newstaq-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=newstaq-cluster"

print("🔍 Test de connexion MongoDB...")
print(f"URL: {MONGO_URL[:50]}...")

try:
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
    
    # Test ping
    client.admin.command('ping')
    print("✅ SUCCÈS - Connexion MongoDB OK!")
    
    # Lister les databases
    dbs = client.list_database_names()
    print(f"✅ Databases disponibles: {dbs}")
    
    client.close()
    sys.exit(0)
    
except Exception as e:
    print(f"❌ ÉCHEC - Erreur: {e}")
    sys.exit(1)