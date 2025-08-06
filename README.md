<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 1000px; margin: auto; padding: 20px;">

  <h1>Cloud Orchestrator: Kubernetes-Powered App Management Platform</h1>

  <!-- Tech Badges -->
  <div style="margin-bottom: 20px;">
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React Badge">
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge">
    <img src="https://img.shields.io/badge/fastapi-%2300C7B7.svg?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI Badge">
    <img src="https://img.shields.io/badge/python-%233776AB.svg?style=for-the-badge&logo=python&logoColor=white" alt="Python Badge">
    <img src="https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes Badge">
    <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions Badge">
    <img src="https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Badge">
  </div>

  <p><strong>CloudNative Orchestrator</strong> is a full-stack cloud-native dashboard for managing Kubernetes applications with GitOps, FastAPI backend, and React + TypeScript frontend. It offers real-time cluster monitoring, deployment metrics, and CI/CD visibility.</p>

  <p>
    🐳 Docker Image:  
    <a href="https://hub.docker.com/repository/docker/johannes613/cloudnative-orchestrator" target="_blank">
      https://hub.docker.com/repository/docker/johannes613/cloudnative-orchestrator
    </a>
  </p>

  <p>
    🔄 GitHub Actions CI/CD: Automatically builds and pushes to Docker Hub on every push to <code>main</code>.
    Workflow file: <code>.github/workflows/docker-build.yml</code>
  </p>

  <hr/>

  <h2>Live Preview</h2>
  <p><em>Frontend: <a href="https://cloudnative-orchestrator.vercel.app" target="_blank">cloudnative-orchestrator.vercel.app</a></em></p>

  <h3>Demo</h3>
  <img src="https://github.com/user-attachments/assets/preview.gif" alt="Demo GIF" style="max-width: 100%; height: auto;" />
  <img src="https://github.com/user-attachments/assets/screenshot.png" alt="Screenshot" width="100%" />

  <hr/>

  <h2>The Problem</h2>
  <ul>
    <li><strong>Low visibility:</strong> No easy way to see real-time deployment and cluster health across environments.</li>
    <li><strong>Manual processes:</strong> DevOps workflows often lack automation and rollback capability.</li>
    <li><strong>Complex setup:</strong> Managing GitOps manually is error-prone and time-consuming.</li>
  </ul>

  <p>This app centralizes deployment visibility, CI/CD automation, and live metrics into one beautiful interface.</p>

  <hr/>

  <h2>Features</h2>

  <h3>1. GitOps Monitoring</h3>
  <ul>
    <li>Track GitHub repositories and deployment history.</li>
    <li>Show deployment status: success, pending, failed.</li>
    <li>Average deployment time metrics.</li>
  </ul>

  <h3>2. Cluster Dashboard</h3>
  <ul>
    <li>Live metrics for pods, nodes, and services.</li>
    <li>Timeline and rollback for deployments.</li>
  </ul>

  <h3>3. FastAPI Backend</h3>
  <ul>
    <li>Handles API requests for deployments and metrics.</li>
    <li>Async endpoints using <code>httpx</code>, <code>pydantic</code>, and <code>uvicorn</code>.</li>
  </ul>

  <h3>4. CI/CD & Docker Integration</h3>
  <ul>
    <li>GitHub Actions pipeline: auto build → test → Docker push.</li>
    <li>Images available on Docker Hub.</li>
  </ul>

  <hr/>

  <h2>Tech Stack</h2>
  <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse;">
    <tr style="background-color: #f2f2f2;"><th>Layer</th><th>Technologies Used</th></tr>
    <tr><td><strong>Frontend</strong></td><td>React, TypeScript, Material UI, Lucide Icons</td></tr>
    <tr><td><strong>Backend</strong></td><td>Python, FastAPI, Uvicorn, Pydantic</td></tr>
    <tr><td><strong>CI/CD</strong></td><td>GitHub Actions (Docker Build & Push)</td></tr>
    <tr><td><strong>Containerization</strong></td><td>Docker</td></tr>
    <tr><td><strong>Orchestration</strong></td><td>Kubernetes, GitOps Principles</td></tr>
    <tr><td><strong>Monitoring</strong></td><td>Simulated Real-Time Metrics</td></tr>
  </table>

  <hr/>

  <h2>Getting Started</h2>

  <h3>Frontend Setup</h3>

  <ol>
    <li><strong>Clone the repo:</strong>
      <pre><code>git clone https://github.com/your-username/cloudnative-orchestrator.git
cd cloudnative-orchestrator/frontend</code></pre>
    </li>
    <li><strong>Install dependencies:</strong>
      <pre><code>npm install</code></pre>
    </li>
    <li><strong>Start development server:</strong>
      <pre><code>npm run dev</code></pre>
      <p>App will run at <code>http://localhost:3000</code></p>
    </li>
  </ol>

  <h3>Backend Setup (FastAPI)</h3>

  <ol>
    <li><strong>Navigate to backend folder:</strong>
      <pre><code>cd ../backend</code></pre>
    </li>
    <li><strong>Create virtual environment:</strong>
      <pre><code>python -m venv venv
source venv/bin/activate  # on Windows use: venv\Scripts\activate</code></pre>
    </li>
    <li><strong>Install requirements:</strong>
      <pre><code>pip install -r requirements.txt</code></pre>
    </li>
    <li><strong>Run FastAPI server:</strong>
      <pre><code>uvicorn main:app --reload</code></pre>
      <p>Server will be running at <code>http://localhost:8000</code></p>
    </li>
  </ol>

  <h4>Example File Structure</h4>
  <pre><code>
cloudnative-orchestrator/
├── frontend/         # React + TypeScript + MUI
│   └── ...
├── backend/          # FastAPI
│   ├── main.py
│   ├── models/
│   └── routes/
├── .github/
│   └── workflows/docker-build.yml
  </code></pre>

  <hr/>


</body>
</html>
