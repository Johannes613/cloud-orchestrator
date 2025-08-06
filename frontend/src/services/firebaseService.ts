import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Application, CreateApplicationData, UpdateApplicationData } from '../types/application';
import type { Repository, CreateRepositoryData, UpdateRepositoryData, DeploymentHistory, CreateDeploymentHistoryData } from '../types/gitops';

// Initialize Firestore collections
const APPLICATIONS_COLLECTION = 'applications';
const METRICS_COLLECTION = 'metrics';
const LOGS_COLLECTION = 'logs';
const VULNERABILITIES_COLLECTION = 'vulnerabilities';
const DEPLOYMENTS_COLLECTION = 'deployments';
const CLUSTERS_COLLECTION = 'clusters';
const REPOSITORIES_COLLECTION = 'repositories';
const DEPLOYMENT_HISTORY_COLLECTION = 'deployment_history';
const USERS_COLLECTION = 'users';

// Types for deployments and clusters
export interface Deployment {
  id: string;
  applicationId: string;
  applicationName: string;
  version: string;
  environment: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled_back';
  startTime: string;
  endTime?: string;
  replicas: number;
  namespace: string;
  image: string;
  logs: string[];
  metrics: {
    cpu: number;
    memory: number;
    network: number;
  };
}

export interface Cluster {
  id: string;
  name: string;
  provider: string;
  region: string;
  status: 'active' | 'inactive' | 'maintenance';
  nodes: number;
  cpu: {
    total: number;
    used: number;
    available: number;
  };
  memory: {
    total: number;
    used: number;
    available: number;
  };
  storage: {
    total: number;
    used: number;
    available: number;
  };
  applications: number;
  created: string;
  updated: string;
}

class FirebaseService {
  // Applications
  async getApplications(userId: string): Promise<Application[]> {
    try {
      const q = query(
        collection(db, APPLICATIONS_COLLECTION),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created: doc.data().created?.toDate?.()?.toISOString() || doc.data().created,
        updated: doc.data().updated?.toDate?.()?.toISOString() || doc.data().updated,
      })) as Application[];
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw new Error('Failed to fetch applications');
    }
  }

  async getApplication(id: string): Promise<Application> {
    try {
      const docRef = doc(db, APPLICATIONS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Application not found');
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        created: data.created?.toDate?.()?.toISOString() || data.created,
        updated: data.updated?.toDate?.()?.toISOString() || data.updated,
      } as Application;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw new Error('Failed to fetch application');
    }
  }

  async createApplication(data: CreateApplicationData, userId: string): Promise<Application> {
    try {
      const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), {
        ...data,
        userId,
        status: 'Pending',
        created: serverTimestamp(),
        updated: serverTimestamp(),
        health: {
          status: 'healthy',
          lastCheck: new Date().toISOString(),
          uptime: 0,
          responseTime: 0,
          errorRate: 0,
        },
        metrics: {
          cpu: { current: 0, limit: 100, unit: 'm' },
          memory: { current: 0, limit: 100, unit: 'Mi' },
          network: { bytesIn: 0, bytesOut: 0 },
          requests: { total: 0, perSecond: 0, errors: 0 },
        },
        logs: [],
        vulnerabilities: [],
      });

      return this.getApplication(docRef.id);
    } catch (error) {
      console.error('Error creating application:', error);
      throw new Error('Failed to create application');
    }
  }

  async updateApplication(id: string, data: UpdateApplicationData): Promise<Application> {
    try {
      const docRef = doc(db, APPLICATIONS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updated: serverTimestamp(),
      });

      return this.getApplication(id);
    } catch (error) {
      console.error('Error updating application:', error);
      throw new Error('Failed to update application');
    }
  }

  async deleteApplication(id: string): Promise<{ message: string }> {
    try {
      await deleteDoc(doc(db, APPLICATIONS_COLLECTION, id));
      return { message: 'Application deleted successfully' };
    } catch (error) {
      console.error('Error deleting application:', error);
      throw new Error('Failed to delete application');
    }
  }

  // Deployments
  async getDeployments(userId: string): Promise<Deployment[]> {
    try {
      const q = query(
        collection(db, DEPLOYMENTS_COLLECTION),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate?.()?.toISOString() || doc.data().startTime,
        endTime: doc.data().endTime?.toDate?.()?.toISOString() || doc.data().endTime,
      })) as Deployment[];
    } catch (error) {
      console.error('Error fetching deployments:', error);
      throw new Error('Failed to fetch deployments');
    }
  }

  async createDeployment(data: Omit<Deployment, 'id' | 'startTime' | 'endTime'>, userId: string): Promise<Deployment> {
    try {
      const docRef = await addDoc(collection(db, DEPLOYMENTS_COLLECTION), {
        ...data,
        userId,
        startTime: serverTimestamp(),
        status: 'pending',
        logs: [],
        metrics: {
          cpu: 0,
          memory: 0,
          network: 0,
        },
      });

      return this.getDeployment(docRef.id);
    } catch (error) {
      console.error('Error creating deployment:', error);
      throw new Error('Failed to create deployment');
    }
  }

  async getDeployment(id: string): Promise<Deployment> {
    try {
      const docRef = doc(db, DEPLOYMENTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Deployment not found');
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        startTime: data.startTime?.toDate?.()?.toISOString() || data.startTime,
        endTime: data.endTime?.toDate?.()?.toISOString() || data.endTime,
      } as Deployment;
    } catch (error) {
      console.error('Error fetching deployment:', error);
      throw new Error('Failed to fetch deployment');
    }
  }

  async updateDeployment(id: string, data: Partial<Deployment>): Promise<Deployment> {
    try {
      const docRef = doc(db, DEPLOYMENTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updated: serverTimestamp(),
      });

      return this.getDeployment(id);
    } catch (error) {
      console.error('Error updating deployment:', error);
      throw new Error('Failed to update deployment');
    }
  }

  // Clusters
  async getClusters(userId: string): Promise<Cluster[]> {
    try {
      const q = query(
        collection(db, CLUSTERS_COLLECTION),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created: doc.data().created?.toDate?.()?.toISOString() || doc.data().created,
        updated: doc.data().updated?.toDate?.()?.toISOString() || doc.data().updated,
      })) as Cluster[];
    } catch (error) {
      console.error('Error fetching clusters:', error);
      throw new Error('Failed to fetch clusters');
    }
  }

  async createCluster(data: Omit<Cluster, 'id' | 'created' | 'updated'>, userId: string): Promise<Cluster> {
    try {
      const docRef = await addDoc(collection(db, CLUSTERS_COLLECTION), {
        ...data,
        userId,
        created: serverTimestamp(),
        updated: serverTimestamp(),
      });

      return this.getCluster(docRef.id);
    } catch (error) {
      console.error('Error creating cluster:', error);
      throw new Error('Failed to create cluster');
    }
  }

  async getCluster(id: string): Promise<Cluster> {
    try {
      const docRef = doc(db, CLUSTERS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Cluster not found');
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        created: data.created?.toDate?.()?.toISOString() || data.created,
        updated: data.updated?.toDate?.()?.toISOString() || data.updated,
      } as Cluster;
    } catch (error) {
      console.error('Error fetching cluster:', error);
      throw new Error('Failed to fetch cluster');
    }
  }

  async updateCluster(id: string, data: Partial<Cluster>): Promise<Cluster> {
    try {
      const docRef = doc(db, CLUSTERS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updated: serverTimestamp(),
      });

      return this.getCluster(id);
    } catch (error) {
      console.error('Error updating cluster:', error);
      throw new Error('Failed to update cluster');
    }
  }

  // Metrics
  async updateApplicationMetrics(id: string, metrics: any): Promise<{ message: string }> {
    try {
      const docRef = doc(db, APPLICATIONS_COLLECTION, id);
      await updateDoc(docRef, {
        metrics,
        updated: serverTimestamp(),
      });
      return { message: 'Metrics updated successfully' };
    } catch (error) {
      console.error('Error updating metrics:', error);
      throw new Error('Failed to update metrics');
    }
  }

  // Health
  async updateApplicationHealth(id: string, health: any): Promise<{ message: string }> {
    try {
      const docRef = doc(db, APPLICATIONS_COLLECTION, id);
      await updateDoc(docRef, {
        health,
        updated: serverTimestamp(),
      });
      return { message: 'Health updated successfully' };
    } catch (error) {
      console.error('Error updating health:', error);
      throw new Error('Failed to update health');
    }
  }

  // Logs
  async addApplicationLog(id: string, logData: {
    level: string;
    source: string;
    message: string;
  }): Promise<{ message: string }> {
    try {
      const logEntry = {
        ...logData,
        timestamp: serverTimestamp(),
        id: Date.now().toString(),
      };

      const docRef = doc(db, APPLICATIONS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Application not found');
      }

      const currentLogs = docSnap.data().logs || [];
      const updatedLogs = [...currentLogs, logEntry].slice(-100); // Keep last 100 logs

      await updateDoc(docRef, {
        logs: updatedLogs,
        updated: serverTimestamp(),
      });

      return { message: 'Log added successfully' };
    } catch (error) {
      console.error('Error adding log:', error);
      throw new Error('Failed to add log');
    }
  }

  // Vulnerabilities
  async addApplicationVulnerability(id: string, vulnerabilityData: {
    severity: string;
    title: string;
    description: string;
    cve: string;
    cvss: number;
    package: string;
    version: string;
    fixedIn: string;
    discovered: string;
    status: string;
  }): Promise<{ message: string }> {
    try {
      const vulnerability = {
        ...vulnerabilityData,
        id: Date.now().toString(),
        discovered: new Date().toISOString(),
      };

      const docRef = doc(db, APPLICATIONS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Application not found');
      }

      const currentVulnerabilities = docSnap.data().vulnerabilities || [];
      const updatedVulnerabilities = [...currentVulnerabilities, vulnerability];

      await updateDoc(docRef, {
        vulnerabilities: updatedVulnerabilities,
        updated: serverTimestamp(),
      });

      return { message: 'Vulnerability added successfully' };
    } catch (error) {
      console.error('Error adding vulnerability:', error);
      throw new Error('Failed to add vulnerability');
    }
  }

  // Real-time listeners
  subscribeToApplications(callback: (applications: Application[]) => void) {
    return onSnapshot(collection(db, APPLICATIONS_COLLECTION), (snapshot) => {
      const applications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created: doc.data().created?.toDate?.()?.toISOString() || doc.data().created,
        updated: doc.data().updated?.toDate?.()?.toISOString() || doc.data().updated,
      })) as Application[];
      callback(applications);
    });
  }

  subscribeToApplication(id: string, callback: (application: Application) => void) {
    return onSnapshot(doc(db, APPLICATIONS_COLLECTION, id), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const application = {
          id: docSnap.id,
          ...data,
          created: data.created?.toDate?.()?.toISOString() || data.created,
          updated: data.updated?.toDate?.()?.toISOString() || data.updated,
        } as Application;
        callback(application);
      }
    });
  }

  subscribeToDeployments(callback: (deployments: Deployment[]) => void) {
    return onSnapshot(collection(db, DEPLOYMENTS_COLLECTION), (snapshot) => {
      const deployments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate?.()?.toISOString() || doc.data().startTime,
        endTime: doc.data().endTime?.toDate?.()?.toISOString() || doc.data().endTime,
      })) as Deployment[];
      callback(deployments);
    });
  }

  subscribeToClusters(callback: (clusters: Cluster[]) => void) {
    return onSnapshot(collection(db, CLUSTERS_COLLECTION), (snapshot) => {
      const clusters = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created: doc.data().created?.toDate?.()?.toISOString() || doc.data().created,
        updated: doc.data().updated?.toDate?.()?.toISOString() || doc.data().updated,
      })) as Cluster[];
      callback(clusters);
    });
  }

  // Dashboard data
  async getDashboardStats(userId: string) {
    try {
      const applications = await this.getApplications(userId);
      const deployments = await this.getDeployments(userId);
      const clusters = await this.getClusters(userId);
      
      const stats = {
        totalApplications: applications.length,
        runningApplications: applications.filter(app => app.status === 'Running').length,
        failedApplications: applications.filter(app => app.status === 'Failed').length,
        totalReplicas: applications.reduce((sum, app) => sum + app.replicas, 0),
        averageCpuUsage: applications.reduce((sum, app) => sum + (app.metrics?.cpu?.current || 0), 0) / applications.length || 0,
        averageMemoryUsage: applications.reduce((sum, app) => sum + (app.metrics?.memory?.current || 0), 0) / applications.length || 0,
        totalDeployments: deployments.length,
        activeDeployments: deployments.filter(dep => dep.status === 'running').length,
        totalClusters: clusters.length,
        activeClusters: clusters.filter(cluster => cluster.status === 'active').length,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard stats');
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; service: string }> {
    try {
      // Simple health check by trying to access Firestore
      await getDocs(collection(db, APPLICATIONS_COLLECTION));
      return { status: 'healthy', service: 'firebase' };
    } catch (error) {
      return { status: 'unhealthy', service: 'firebase' };
    }
  }

  // GitOps Repository methods
  async getRepositories(userId: string): Promise<Repository[]> {
    try {
      const q = query(
        collection(db, REPOSITORIES_COLLECTION),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created: doc.data().created?.toDate?.()?.toISOString() || doc.data().created,
        updated: doc.data().updated?.toDate?.()?.toISOString() || doc.data().updated,
        lastDeployed: doc.data().lastDeployed?.toDate?.()?.toISOString() || doc.data().lastDeployed,
        lastSync: doc.data().lastSync?.toDate?.()?.toISOString() || doc.data().lastSync,
      })) as Repository[];
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw new Error('Failed to fetch repositories');
    }
  }

  async createRepository(data: CreateRepositoryData, userId: string): Promise<Repository> {
    try {
      const docRef = await addDoc(collection(db, REPOSITORIES_COLLECTION), {
        ...data,
        userId,
        branch: data.branch || 'main',
        autoDeploy: data.autoDeploy || false,
        environment: data.environment || 'production',
        namespace: data.namespace || 'default',
        path: data.path || '/',
        syncInterval: data.syncInterval || 300,
        status: 'Active',
        lastDeployed: null,
        lastSync: null,
        commitCount: 0,
        deploymentCount: 0,
        created: serverTimestamp(),
        updated: serverTimestamp(),
      });

      const docSnap = await getDoc(docRef);
      return {
        id: docRef.id,
        ...docSnap.data(),
        created: docSnap.data()?.created?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated: docSnap.data()?.updated?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastDeployed: docSnap.data()?.lastDeployed?.toDate?.()?.toISOString() || null,
        lastSync: docSnap.data()?.lastSync?.toDate?.()?.toISOString() || null,
      } as Repository;
    } catch (error) {
      console.error('Error creating repository:', error);
      throw new Error('Failed to create repository');
    }
  }

  async updateRepository(id: string, data: UpdateRepositoryData): Promise<Repository> {
    try {
      const docRef = doc(db, REPOSITORIES_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updated: serverTimestamp(),
      });

      const docSnap = await getDoc(docRef);
      return {
        id: docSnap.id,
        ...docSnap.data(),
        created: docSnap.data()?.created?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated: docSnap.data()?.updated?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastDeployed: docSnap.data()?.lastDeployed?.toDate?.()?.toISOString() || null,
        lastSync: docSnap.data()?.lastSync?.toDate?.()?.toISOString() || null,
      } as Repository;
    } catch (error) {
      console.error('Error updating repository:', error);
      throw new Error('Failed to update repository');
    }
  }

  async deleteRepository(id: string): Promise<{ message: string }> {
    try {
      await deleteDoc(doc(db, REPOSITORIES_COLLECTION, id));
      return { message: 'Repository deleted successfully' };
    } catch (error) {
      console.error('Error deleting repository:', error);
      throw new Error('Failed to delete repository');
    }
  }

  async syncRepository(id: string): Promise<{ message: string; repository: Repository }> {
    try {
      const docRef = doc(db, REPOSITORIES_COLLECTION, id);
      
      // Update status to syncing
      await updateDoc(docRef, {
        status: 'Syncing',
        lastSync: serverTimestamp(),
        updated: serverTimestamp(),
      });

      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update status back to active
      await updateDoc(docRef, {
        status: 'Active',
        updated: serverTimestamp(),
      });

      const docSnap = await getDoc(docRef);
      const repository = {
        id: docSnap.id,
        ...docSnap.data(),
        created: docSnap.data()?.created?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated: docSnap.data()?.updated?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastDeployed: docSnap.data()?.lastDeployed?.toDate?.()?.toISOString() || null,
        lastSync: docSnap.data()?.lastSync?.toDate?.()?.toISOString() || null,
      } as Repository;

      return {
        message: 'Repository synced successfully',
        repository
      };
    } catch (error) {
      console.error('Error syncing repository:', error);
      throw new Error('Failed to sync repository');
    }
  }

  // Deployment History methods
  async getDeploymentHistory(userId: string): Promise<DeploymentHistory[]> {
    try {
      const q = query(
        collection(db, DEPLOYMENT_HISTORY_COLLECTION),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created: doc.data().created?.toDate?.()?.toISOString() || doc.data().created,
        timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || doc.data().timestamp,
      })) as DeploymentHistory[];
    } catch (error) {
      console.error('Error fetching deployment history:', error);
      throw new Error('Failed to fetch deployment history');
    }
  }

  async createDeploymentHistory(data: CreateDeploymentHistoryData, userId: string): Promise<DeploymentHistory> {
    try {
      const docRef = await addDoc(collection(db, DEPLOYMENT_HISTORY_COLLECTION), {
        ...data,
        userId,
        branch: data.branch || 'main',
        author: data.author || 'Unknown',
        status: data.status || 'pending',
        duration: data.duration || 0,
        environment: data.environment || 'production',
        namespace: data.namespace || 'default',
        resources: data.resources || {
          deployments: 0,
          services: 0,
          configMaps: 0,
          secrets: 0,
        },
        logs: data.logs || [],
        timestamp: serverTimestamp(),
        created: serverTimestamp(),
      });

      const docSnap = await getDoc(docRef);
      return {
        id: docRef.id,
        ...docSnap.data(),
        created: docSnap.data()?.created?.toDate?.()?.toISOString() || new Date().toISOString(),
        timestamp: docSnap.data()?.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as DeploymentHistory;
    } catch (error) {
      console.error('Error creating deployment history:', error);
      throw new Error('Failed to create deployment history');
    }
  }

  // Real-time listeners for GitOps
  subscribeToRepositories(userId: string, callback: (repositories: Repository[]) => void) {
    const q = query(
      collection(db, REPOSITORIES_COLLECTION),
      where('userId', '==', userId)
    );
    return onSnapshot(q, (querySnapshot) => {
      const repositories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created: doc.data().created?.toDate?.()?.toISOString() || doc.data().created,
        updated: doc.data().updated?.toDate?.()?.toISOString() || doc.data().updated,
        lastDeployed: doc.data().lastDeployed?.toDate?.()?.toISOString() || doc.data().lastDeployed,
        lastSync: doc.data().lastSync?.toDate?.()?.toISOString() || doc.data().lastSync,
      })) as Repository[];
      callback(repositories);
    });
  }

  subscribeToDeploymentHistory(userId: string, callback: (deploymentHistory: DeploymentHistory[]) => void) {
    const q = query(
      collection(db, DEPLOYMENT_HISTORY_COLLECTION),
      where('userId', '==', userId)
    );
    return onSnapshot(q, (querySnapshot) => {
      const deploymentHistory = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created: doc.data().created?.toDate?.()?.toISOString() || doc.data().created,
        timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || doc.data().timestamp,
      })) as DeploymentHistory[];
      callback(deploymentHistory);
    });
  }

  // User Profile methods
  async getUserProfile(userId: string) {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          created: docSnap.data().created?.toDate?.()?.toISOString() || docSnap.data().created,
          updated: docSnap.data().updated?.toDate?.()?.toISOString() || docSnap.data().updated,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  async updateUserProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
    position?: string;
  }) {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Update existing profile
        await updateDoc(docRef, {
          ...data,
          updated: serverTimestamp(),
        });
      } else {
        // Create new profile
        await setDoc(docRef, {
          ...data,
          created: serverTimestamp(),
          updated: serverTimestamp(),
        });
      }
      
      return { message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }
}

export const firebaseService = new FirebaseService(); 