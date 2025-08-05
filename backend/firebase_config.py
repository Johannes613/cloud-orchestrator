import firebase_admin
from firebase_admin import credentials, firestore
import os

# Firebase configuration
firebase_config = {
    "apiKey": "AIzaSyDa-NPOzvKVLX-8cCULrp1y04-__gLaldA",
    "authDomain": "cloud-native-app-351d4.firebaseapp.com",
    "projectId": "cloud-native-app-351d4",
    "storageBucket": "cloud-native-app-351d4.firebasestorage.app",
    "messagingSenderId": "825276618446",
    "appId": "1:825276618446:web:da0c2e8d2247f0326d629f",
    "measurementId": "G-NNKQMG9X8M"
}

# Initialize Firebase Admin SDK
# For production, you should use a service account key file
# For now, we'll use the default credentials
try:
    # Try to initialize with existing app
    firebase_admin.get_app()
except ValueError:
    # Initialize if no app exists
    firebase_admin.initialize_app()

# Get Firestore client
db = firestore.client()

def get_firestore_db():
    """Get Firestore database instance"""
    return db 