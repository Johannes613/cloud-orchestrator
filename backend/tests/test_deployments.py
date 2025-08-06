import requests
import json

def test_deployment_integration():
    """Test the deployment integration"""
    base_url = "http://localhost:8000"
    
    print("Testing Deployment Integration...")
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
    
    # Test 2: Get applications (needed for deployment)
    print("\n2. Testing get applications...")
    try:
        response = requests.get(f"{base_url}/api/applications")
        if response.status_code == 200:
            apps = response.json()
            print(f"✅ Found {len(apps)} applications")
            if len(apps) > 0:
                app_id = apps[0]['id']
                print(f"   Using application ID: {app_id}")
            else:
                print("❌ No applications found")
                return
        else:
            print(f"❌ Get applications failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Get applications error: {e}")
        return
    
    # Test 3: Get deployments
    print("\n3. Testing get deployments...")
    try:
        response = requests.get(f"{base_url}/api/deployments")
        if response.status_code == 200:
            deployments = response.json()
            print(f"✅ Found {len(deployments)} deployments")
            for deployment in deployments:
                print(f"   - {deployment['version']} ({deployment['status']})")
        else:
            print(f"❌ Get deployments failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Get deployments error: {e}")
    
    # Test 4: Create deployment
    print("\n4. Testing create deployment...")
    new_deployment = {
        "application_id": app_id,
        "version": "v1.3.0",
        "environment": "staging",
        "commit_hash": "abc123def456",
        "description": "Test deployment for integration",
        "triggered_by": "test@company.com"
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/deployments",
            json=new_deployment,
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 201:
            created_deployment = response.json()
            print(f"✅ Created deployment: {created_deployment['version']} (ID: {created_deployment['id']})")
            
            # Test 5: Get the created deployment
            print("\n5. Testing get specific deployment...")
            deployment_id = created_deployment['id']
            response = requests.get(f"{base_url}/api/deployments/{deployment_id}")
            if response.status_code == 200:
                deployment = response.json()
                print(f"✅ Retrieved deployment: {deployment['version']}")
            else:
                print(f"❌ Get specific deployment failed: {response.status_code}")
                
        else:
            print(f"❌ Create deployment failed: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Create deployment error: {e}")
    
    # Test 6: Get all deployments again
    print("\n6. Testing get deployments after creation...")
    try:
        response = requests.get(f"{base_url}/api/deployments")
        if response.status_code == 200:
            deployments = response.json()
            print(f"✅ Found {len(deployments)} deployments")
            test_deployments = [d for d in deployments if d['version'] == 'v1.3.0']
            if test_deployments:
                print("✅ Test deployment found in Firebase!")
            else:
                print("❌ Test deployment not found in Firebase")
        else:
            print(f"❌ Get deployments failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Get deployments error: {e}")
    
    # Test 7: Test rollback (if we have a deployment)
    print("\n7. Testing rollback functionality...")
    try:
        response = requests.get(f"{base_url}/api/deployments")
        if response.status_code == 200:
            deployments = response.json()
            if len(deployments) > 0:
                deployment_to_rollback = deployments[0]
                rollback_response = requests.post(
                    f"{base_url}/api/deployments/{deployment_to_rollback['id']}/rollback"
                )
                if rollback_response.status_code == 200:
                    rollback_result = rollback_response.json()
                    print(f"✅ Rollback initiated successfully! Rollback ID: {rollback_result['rollback_id']}")
                else:
                    print(f"❌ Rollback failed: {rollback_response.status_code}")
            else:
                print("❌ No deployments available for rollback test")
        else:
            print(f"❌ Get deployments failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Rollback test error: {e}")
    
    print("\n" + "=" * 50)
    print("Deployment Integration Test Complete!")

if __name__ == "__main__":
    test_deployment_integration() 