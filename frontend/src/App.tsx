// File: src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/shared/Sidebar.tsx';
import LandingPage from './pages/LandingPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import ApplicationsPage from './pages/ApplicationsPage.tsx';
import ApplicationDetailsPage from './pages/ApplicationDetailsPage.tsx'; // New component for app details
import DeploymentsPage from './pages/DeploymentsPage.tsx';
import ClustersPage from './pages/ClustersPage.tsx';
import GitOpsPage from './pages/GitOpsPage.tsx';
import LogsPage from './pages/LogsPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app/*" element={
                    <Sidebar>
                        <Routes>
                            <Route path="" element={<DashboardPage />} />
                            <Route path="applications" element={<ApplicationsPage />} />
                            <Route path="applications/:id" element={<ApplicationDetailsPage />} />
                            <Route path="deployments" element={<DeploymentsPage />} />
                            <Route path="clusters" element={<ClustersPage />} />
                            <Route path="gitops" element={<GitOpsPage />} />
                            <Route path="logs" element={<LogsPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                        </Routes>
                    </Sidebar>
                } />
            </Routes>
        </AuthProvider>
    );
};

export default App;
