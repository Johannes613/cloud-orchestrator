import firebase_admin
from firebase_admin import credentials, firestore
import json

# Firebase configuration from the user
firebase_config = {
    "apiKey": "AIzaSyDa-NPOzvKVLX-8cCULrp1y04-__gLaldA",
    "authDomain": "cloud-native-app-351d4.firebaseapp.com",
    "projectId": "cloud-native-app-351d4",
    "storageBucket": "cloud-native-app-351d4.firebasestorage.app",
    "messagingSenderId": "825276618446",
    "appId": "1:825276618446:web:da0c2e8d2247f0326d629f",
    "measurementId": "G-NNKQMG9X8M"
}

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Check if Firebase is already initialized
        firebase_admin.get_app()
        print("✅ Firebase already initialized")
    except ValueError:
        # Initialize Firebase with default credentials
        # For development, we'll use the default credentials
        # In production, you should use a service account key file
        firebase_admin.initialize_app()
        print("✅ Firebase initialized successfully")
    
    return firestore.client()

def get_firestore_client():
    """Get Firestore client"""
    return initialize_firebase() 