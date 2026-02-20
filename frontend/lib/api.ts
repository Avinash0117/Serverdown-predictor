import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Metrics
export const getLiveMetrics = async () => {
  const response = await api.get('/metrics/live');
  return response.data;
};

// Incidents
export const getIncidents = async () => {
  const response = await api.get('/incidents');
  return response.data;
};

export const createIncident = async (severity: string, message: string) => {
  const response = await api.post('/incidents/create', { severity, message });
  return response.data;
};

// Maintenance
export const getMaintenanceStatus = async () => {
  const response = await api.get('/maintenance');
  return response.data;
};

export const enableMaintenance = async (etaMinutes: number) => {
  const response = await api.post('/maintenance/enable', { eta_minutes: etaMinutes });
  return response.data;
};

export const disableMaintenance = async () => {
  const response = await api.post('/maintenance/disable');
  return response.data;
};

// Prediction
export const predictUpdateRisk = async (data: {
  update_title: string;
  update_type: string;
  services_affected: string[];
  db_migration: boolean;
  expected_minutes: number;
  description: string;
}) => {
  const response = await api.post('/predict/update-risk', data);
  return response.data;
};
