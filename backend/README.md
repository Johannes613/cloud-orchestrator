# Cloud Native App Orchestrator - Backend

A FastAPI-based backend service for managing cloud-native applications, deployments, and monitoring.

## Project Structure

```
backend/
├── app.py                 # Main FastAPI application
├── run.py                 # Server entry point
├── requirements.txt       # Python dependencies
├── config/               # Configuration files
│   ├── __init__.py
│   └── firebase_config.py
├── models/               # Data models
│   ├── __init__.py
│   └── application.py
├── services/             # Business logic services
│   ├── __init__.py
│   └── application_service.py
├── data/                 # Data storage
│   ├── applications.json
│   └── deployments.json
├── utils/                # Utility functions
│   ├── __init__.py
│   └── seed_data.py
└── tests/                # Test files
    ├── test_deployments.py
    └── test_firebase.py
```

## Features

- **Application Management**: CRUD operations for cloud-native applications
- **Health Monitoring**: Real-time health status tracking
- **Metrics Collection**: CPU, memory, network, and request metrics
- **Log Management**: Application log collection and storage
- **Vulnerability Scanning**: Security vulnerability tracking
- **RESTful API**: Clean, documented API endpoints
- **CORS Support**: Frontend integration ready

## API Endpoints

### Applications
- `GET /api/applications` - Get all applications
- `GET /api/applications/{app_id}` - Get specific application
- `POST /api/applications` - Create new application
- `PUT /api/applications/{app_id}` - Update application
- `DELETE /api/applications/{app_id}` - Delete application

### Application Features
- `PUT /api/applications/{app_id}/metrics` - Update metrics
- `PUT /api/applications/{app_id}/health` - Update health status
- `POST /api/applications/{app_id}/logs` - Add log entry
- `POST /api/applications/{app_id}/vulnerabilities` - Add vulnerability

### Deployments
- `GET /api/deployments` - Get all deployments
- `GET /api/deployments/{deployment_id}` - Get specific deployment
- `POST /api/deployments` - Create new deployment
- `PUT /api/deployments/{deployment_id}` - Update deployment
- `DELETE /api/deployments/{deployment_id}` - Delete deployment
- `POST /api/deployments/{deployment_id}/rollback` - Rollback deployment

### System
- `GET /` - API information
- `GET /health` - Health check

## Getting Started

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Server**:
   ```bash
   python run.py
   ```

3. **Access the API**:
   - API: http://localhost:8000
   - Health Check: http://localhost:8000/health
   - Interactive Docs: http://localhost:8000/docs

## Development

The server runs with auto-reload enabled, so changes to the code will automatically restart the server.

## Architecture

- **FastAPI**: Modern, fast web framework
- **Pydantic**: Data validation and serialization
- **In-Memory Storage**: JSON-based data persistence
- **CORS**: Cross-origin resource sharing for frontend integration 