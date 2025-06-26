const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Machines
  async getMachines() {
    return this.request('/machines');
  }

  async createMachine(machineData) {
    return this.request('/machines', {
      method: 'POST',
      body: JSON.stringify(machineData),
    });
  }

  // Faults
  async getFaults(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/faults?${params}`);
  }

  async createFault(faultData) {
    return this.request('/faults', {
      method: 'POST',
      body: JSON.stringify(faultData),
    });
  }

  // Alerts
  async getAlerts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/alerts?${params}`);
  }

  async createAlert(alertData) {
    return this.request('/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  }

  async updateAlertStatus(id, status) {
    return this.request('/alerts', {
      method: 'PUT',
      body: JSON.stringify({ id, status }),
    });
  }

  // Interventions
  async getInterventions(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/interventions?${params}`);
  }

  async createIntervention(interventionData) {
    return this.request('/interventions', {
      method: 'POST',
      body: JSON.stringify(interventionData),
    });
  }

  async updateIntervention(interventionData) {
    return this.request('/interventions', {
      method: 'PUT',
      body: JSON.stringify(interventionData),
    });
  }

  // Maintenance Schedules
  async getMaintenanceSchedules(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/maintenance-schedules?${params}`);
  }

  async getMaintenanceSchedule(filters = {}) {
    // Backward compatibility method
    return this.getMaintenanceSchedules(filters);
  }

  async createMaintenanceSchedule(scheduleData) {
    return this.request('/maintenance-schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  }

  async updateMaintenanceSchedule(scheduleData) {
    return this.request('/maintenance-schedules', {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    });
  }

  // Taxes
  async getTaxes(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/taxes?${params}`);
  }

  async createTaxe(taxeData) {
    return this.request('/taxes', {
      method: 'POST',
      body: JSON.stringify(taxeData),
    });
  }

  async updateTaxe(taxeData) {
    return this.request('/taxes', {
      method: 'PUT',
      body: JSON.stringify(taxeData),
    });
  }

  async deleteTaxe(id) {
    return this.request(`/taxes?id=${id}`, {
      method: 'DELETE',
    });
  }
}

// Create a singleton instance
const apiClient = new ApiClient();

export default apiClient; 