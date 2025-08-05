from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid
import json

app = Flask(__name__)
CORS(app)

# Simulated Firebase storage (in-memory for now)
applications_db = {}

@app.route('/')
def read_root():
    return jsonify({"message": "Cloud Native App Orchestrator API", "version": "1.0.0"})

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Cloud Native App Orchestrator API"})

# Application endpoints
@app.route('/api/applications', methods=['GET'])
def get_applications():
    """Get all applications from simulated Firebase"""
    try:
        return jsonify(list(applications_db.values()))
    except Exception as e:
        print(f"Error fetching applications: {e}")
        return jsonify([])

@app.route('/api/applications/<app_id>', methods=['GET'])
def get_application(app_id):
    """Get a specific application by ID from simulated Firebase"""
    try:
        if app_id not in applications_db:
            return jsonify({"error": "Application not found"}), 404
        return jsonify(applications_db[app_id])
    except Exception as e:
        return jsonify({"error": f"Error fetching application: {str(e)}"}), 500

@app.route('/api/applications', methods=['POST'])
def create_application():
    """Create a new application in simulated Firebase"""
    try:
        app_data = request.get_json()
        app_id = str(uuid.uuid4())
        current_time = datetime.now().isoformat()
        
        # Create default health status
        health_status = {
            "status": "Starting",
            "lastCheck": current_time,
            "responseTime": 0,
            "uptime": 0,
            "errorRate": 0.0
        }
        
        # Create default metrics
        metrics = {
            "cpu": {
                "current": 0.0,
                "limit": 2.0,
                "unit": "cores"
            },
            "memory": {
                "current": 0,
                "limit": 1024,
                "unit": "Mi"
            },
            "network": {
                "bytesIn": 0,
                "bytesOut": 0
            },
            "requests": {
                "total": 0,
                "perSecond": 0.0,
                "errors": 0
            }
        }
        
        # Create application document
        application_doc = {
            "id": app_id,
            "name": app_data.get("name", "New Application"),
            "description": app_data.get("description", ""),
            "status": "Creating",
            "replicas": app_data.get("replicas", 1),
            "created": current_time,
            "updated": current_time,
            "namespace": app_data.get("namespace", "default"),
            "image": app_data.get("image", "nginx:latest"),
            "version": app_data.get("version", "1.0.0"),
            "environment": app_data.get("environment", "development"),
            "health": health_status,
            "metrics": metrics,
            "resources": app_data.get("resources", {
                "cpu": {"request": "100m", "limit": "500m"},
                "memory": {"request": "128Mi", "limit": "512Mi"},
                "storage": {"size": "1Gi", "type": "SSD"}
            }),
            "logs": [],
            "vulnerabilities": [],
            "tags": app_data.get("tags", []),
            "owner": app_data.get("owner", "admin@company.com"),
            "team": app_data.get("team", "DevOps")
        }
        
        # Save to simulated Firebase
        applications_db[app_id] = application_doc
        
        print(f"✅ Created application in Firebase: {application_doc['name']} (ID: {app_id})")
        
        return jsonify(application_doc), 201
    except Exception as e:
        print(f"Error creating application: {e}")
        return jsonify({"error": f"Error creating application: {str(e)}"}), 500

@app.route('/api/applications/<app_id>', methods=['PUT'])
def update_application(app_id):
    """Update an existing application in simulated Firebase"""
    try:
        if app_id not in applications_db:
            return jsonify({"error": "Application not found"}), 404
        
        app_data = request.get_json()
        current_app = applications_db[app_id]
        
        # Update only provided fields
        for field, value in app_data.items():
            if value is not None:
                current_app[field] = value
        
        current_app['updated'] = datetime.now().isoformat()
        
        # Update in simulated Firebase
        applications_db[app_id] = current_app
        
        print(f"✅ Updated application in Firebase: {current_app['name']}")
        
        return jsonify(current_app)
    except Exception as e:
        return jsonify({"error": f"Error updating application: {str(e)}"}), 500

@app.route('/api/applications/<app_id>', methods=['DELETE'])
def delete_application(app_id):
    """Delete an application from simulated Firebase"""
    try:
        if app_id not in applications_db:
            return jsonify({"error": "Application not found"}), 404
        
        app_name = applications_db[app_id]['name']
        del applications_db[app_id]
        
        print(f"✅ Deleted application from Firebase: {app_name}")
        
        return jsonify({"message": "Application deleted successfully"})
    except Exception as e:
        return jsonify({"error": f"Error deleting application: {str(e)}"}), 500

@app.route('/api/applications/<app_id>/metrics', methods=['PUT'])
def update_application_metrics(app_id):
    """Update application metrics in simulated Firebase"""
    try:
        if app_id not in applications_db:
            return jsonify({"error": "Application not found"}), 404
        
        metrics = request.get_json()
        applications_db[app_id]['metrics'] = metrics
        applications_db[app_id]['updated'] = datetime.now().isoformat()
        
        print(f"✅ Updated metrics in Firebase for: {applications_db[app_id]['name']}")
        
        return jsonify({"message": "Metrics updated successfully"})
    except Exception as e:
        return jsonify({"error": f"Error updating metrics: {str(e)}"}), 500

@app.route('/api/applications/<app_id>/health', methods=['PUT'])
def update_application_health(app_id):
    """Update application health status in simulated Firebase"""
    try:
        if app_id not in applications_db:
            return jsonify({"error": "Application not found"}), 404
        
        health = request.get_json()
        applications_db[app_id]['health'] = health
        applications_db[app_id]['updated'] = datetime.now().isoformat()
        
        print(f"✅ Updated health in Firebase for: {applications_db[app_id]['name']}")
        
        return jsonify({"message": "Health status updated successfully"})
    except Exception as e:
        return jsonify({"error": f"Error updating health: {str(e)}"}), 500

@app.route('/api/applications/<app_id>/logs', methods=['POST'])
def add_application_log(app_id):
    """Add a log entry to an application in simulated Firebase"""
    try:
        if app_id not in applications_db:
            return jsonify({"error": "Application not found"}), 404
        
        log_data = request.get_json()
        log_entry = {
            'id': str(uuid.uuid4()),
            'timestamp': datetime.now().isoformat(),
            **log_data
        }
        
        applications_db[app_id]['logs'].append(log_entry)
        applications_db[app_id]['updated'] = datetime.now().isoformat()
        
        print(f"✅ Added log to Firebase for: {applications_db[app_id]['name']}")
        
        return jsonify({"message": "Log entry added successfully"})
    except Exception as e:
        return jsonify({"error": f"Error adding log: {str(e)}"}), 500

@app.route('/api/applications/<app_id>/vulnerabilities', methods=['POST'])
def add_application_vulnerability(app_id):
    """Add a vulnerability to an application in simulated Firebase"""
    try:
        if app_id not in applications_db:
            return jsonify({"error": "Application not found"}), 404
        
        vulnerability_data = request.get_json()
        vulnerability_entry = {
            'id': str(uuid.uuid4()),
            **vulnerability_data
        }
        
        applications_db[app_id]['vulnerabilities'].append(vulnerability_entry)
        applications_db[app_id]['updated'] = datetime.now().isoformat()
        
        print(f"✅ Added vulnerability to Firebase for: {applications_db[app_id]['name']}")
        
        return jsonify({"message": "Vulnerability added successfully"})
    except Exception as e:
        return jsonify({"error": f"Error adding vulnerability: {str(e)}"}), 500

# Seed some initial data
def seed_initial_data():
    """Seed some initial application data to simulated Firebase"""
    try:
        if len(applications_db) > 0:
            print("Simulated Firebase already has data, skipping seed")
            return
        
        sample_apps = [
            {
                "name": "WebApp-1",
                "description": "Main web application for customer portal",
                "namespace": "default",
                "image": "nginx:1.24",
                "version": "2.1.0",
                "environment": "production",
                "replicas": 3,
                "tags": ["web", "frontend", "customer-portal"],
                "owner": "john.doe@company.com",
                "team": "Frontend"
            },
            {
                "name": "Microservice-A",
                "description": "Authentication and authorization service",
                "namespace": "auth",
                "image": "auth-service:1.2.0",
                "version": "1.2.0",
                "environment": "staging",
                "replicas": 1,
                "tags": ["microservice", "auth", "security"],
                "owner": "jane.smith@company.com",
                "team": "Backend"
            }
        ]
        
        print("Seeding initial data to simulated Firebase...")
        
        for app_data in sample_apps:
            app_id = str(uuid.uuid4())
            current_time = datetime.now().isoformat()
            
            health_status = {
                "status": "Running",
                "lastCheck": current_time,
                "responseTime": 120,
                "uptime": 86400,
                "errorRate": 0.5
            }
            
            metrics = {
                "cpu": {
                    "current": 1.2,
                    "limit": 2.0,
                    "unit": "cores"
                },
                "memory": {
                    "current": 512,
                    "limit": 1024,
                    "unit": "Mi"
                },
                "network": {
                    "bytesIn": 1024 * 1024 * 1024,
                    "bytesOut": 512 * 1024 * 1024
                },
                "requests": {
                    "total": 1500000,
                    "perSecond": 25.5,
                    "errors": 7500
                }
            }
            
            application_doc = {
                "id": app_id,
                "name": app_data["name"],
                "description": app_data["description"],
                "status": "Running",
                "replicas": app_data["replicas"],
                "created": current_time,
                "updated": current_time,
                "namespace": app_data["namespace"],
                "image": app_data["image"],
                "version": app_data["version"],
                "environment": app_data["environment"],
                "health": health_status,
                "metrics": metrics,
                "resources": {
                    "cpu": {"request": "500m", "limit": "2"},
                    "memory": {"request": "256Mi", "limit": "1Gi"},
                    "storage": {"size": "10Gi", "type": "SSD"}
                },
                "logs": [],
                "vulnerabilities": [],
                "tags": app_data["tags"],
                "owner": app_data["owner"],
                "team": app_data["team"]
            }
            
            applications_db[app_id] = application_doc
            print(f"✓ Created application: {app_data['name']}")
        
        print("Seeding completed!")
    except Exception as e:
        print(f"Error seeding data: {e}")

# Seed data on startup
seed_initial_data()

if __name__ == '__main__':
    print("Starting Cloud Native App Orchestrator API with Simulated Firebase...")
    print("API will be available at http://localhost:8000")
    print("Health check: http://localhost:8000/health")
    print("Applications: http://localhost:8000/api/applications")
    print("Firebase integration: SIMULATED (Ready for real Firebase)")
    print("Firebase Project ID: cloud-native-app-351d4")
    print("✅ Ready to test application creation and storage!")
    app.run(host='0.0.0.0', port=8000, debug=True) 