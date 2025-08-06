# Cloud Native App Orchestrator

A comprehensive cloud-native application management platform with real-time monitoring, deployment management, and security scanning capabilities.

## Features

- **Application Management**: Create, update, and monitor applications
- **Real-time Metrics**: CPU, memory, network, and request metrics
- **Health Monitoring**: Application health status and uptime tracking
- **Security Scanning**: Vulnerability detection and management
- **Log Management**: Centralized application logs
- **GitOps Integration**: Automated deployment workflows
- **Multi-cluster Support**: Manage applications across multiple clusters

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Firebase Firestore**: NoSQL database for real-time data
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server

### Frontend
- **React**: UI framework
- **TypeScript**: Type safety
- **Material-UI**: Component library
- **Vite**: Build tool
- **Lucide React**: Icons

## Setup Instructions

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Python** (v3.8 or higher)
3. **Firebase Project** (already configured)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up Firebase**:
   - The Firebase configuration is already set up in `firebase_config.py`
   - For production, you should use a service account key file

6. **Seed initial data** (optional):
   ```bash
   python seed_data.py
   ```

7. **Run the backend server**:
   ```bash
   python run.py
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:5173`

## API Endpoints

### Applications
- `GET /api/applications` - Get all applications
- `GET /api/applications/{id}` - Get specific application
- `POST /api/applications` - Create new application
- `PUT /api/applications/{id}` - Update application
- `DELETE /api/applications/{id}` - Delete application

### Metrics & Health
- `PUT /api/applications/{id}/metrics` - Update application metrics
- `PUT /api/applications/{id}/health` - Update health status

### Logs & Vulnerabilities
- `POST /api/applications/{id}/logs` - Add log entry
- `POST /api/applications/{id}/vulnerabilities` - Add vulnerability

## Firebase Configuration

The application uses Firebase Firestore for data storage. The configuration is set up in `backend/firebase_config.py` with the following project details:

- **Project ID**: cloud-native-app-351d4
- **Database**: Firestore
- **Authentication**: Firebase Admin SDK

## Development

### Backend Development
- The backend uses FastAPI with automatic API documentation
- Visit `http://localhost:8000/docs` for interactive API documentation
- The server supports hot reloading during development

### Frontend Development
- The frontend uses Vite for fast development builds
- TypeScript provides type safety
- Material-UI components follow the bluish and white theme

## Project Structure

```
Cloud_Native_App_Orchestrator/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic models
│   ├── services.py          # Firebase service layer
│   ├── firebase_config.py   # Firebase configuration
│   ├── seed_data.py         # Initial data seeding
│   ├── run.py              # Server startup script
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── data/           # Mock data (for reference)
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.