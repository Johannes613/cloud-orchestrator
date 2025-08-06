import requests
import json

def test_firebase_integration():
    """Test the Firebase integration"""
    base_url = "http://localhost:8000"
    
    print("Testing Firebase Integration...")
    print("=" * 50)
    
    # Test 1: Health check
    print("1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    # Test 2: Get applications
    print("\n2. Testing get applications...")
    try:
        response = requests.get(f"{base_url}/api/applications")
        if response.status_code == 200:
            apps = response.json()
            print(f"✅ Found {len(apps)} applications")
            for app in apps:
                print(f"   - {app['name']} ({app['status']})")
        else:
            print(f"❌ Get applications failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Get applications error: {e}")
    
    # Test 3: Create application
    print("\n3. Testing create application...")
    new_app = {
        "name": "Test-App-Firebase",
        "description": "Test application for Firebase integration",
        "namespace": "test",
        "image": "nginx:latest",
        "version": "1.0.0",
        "environment": "development",
        "replicas": 1,
        "tags": ["test", "firebase"],
        "owner": "test@company.com",
        "team": "Testing"
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/applications",
            json=new_app,
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 201:
            created_app = response.json()
            print(f"✅ Created application: {created_app['name']} (ID: {created_app['id']})")
            
            # Test 4: Get the created application
            print("\n4. Testing get specific application...")
            app_id = created_app['id']
            response = requests.get(f"{base_url}/api/applications/{app_id}")
            if response.status_code == 200:
                app = response.json()
                print(f"✅ Retrieved application: {app['name']}")
            else:
                print(f"❌ Get specific application failed: {response.status_code}")
                
        else:
            print(f"❌ Create application failed: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Create application error: {e}")
    
    # Test 5: Get all applications again
    print("\n5. Testing get applications after creation...")
    try:
        response = requests.get(f"{base_url}/api/applications")
        if response.status_code == 200:
            apps = response.json()
            print(f"✅ Found {len(apps)} applications")
            test_apps = [app for app in apps if app['name'] == 'Test-App-Firebase']
            if test_apps:
                print("✅ Test application found in Firebase!")
            else:
                print("❌ Test application not found in Firebase")
        else:
            print(f"❌ Get applications failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Get applications error: {e}")
    
    print("\n" + "=" * 50)
    print("Firebase Integration Test Complete!")

if __name__ == "__main__":
    test_firebase_integration() 