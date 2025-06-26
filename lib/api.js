const API_BASE_URL = "/api";

export const api = {
  // Auth
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, user: data.user };
    } else {
      const error = await response.json();
      return { success: false, error: error.error || "Login failed" };
    }
  },

  // Faults
  async getFaults(patientId) {
    const url = patientId
      ? `${API_BASE_URL}/faults?patientId=${patientId}`
      : `${API_BASE_URL}/faults`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch faults");
    return response.json();
  },

  async createFault(faultData) {
    const response = await fetch(`${API_BASE_URL}/faults`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faultData),
    });
    if (!response.ok) throw new Error("Failed to create fault");
    return response.json();
  },

  // Alerts
  async getAlerts() {
    const response = await fetch(`${API_BASE_URL}/alerts`);
    if (!response.ok) throw new Error("Failed to fetch alerts");
    return response.json();
  },

  async updateAlertStatus(alertId, status) {
    // This would require a PATCH endpoint - for now return success
    return { success: true };
  },

  async createAlert(alertData) {
    const response = await fetch(`${API_BASE_URL}/alerts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alertData),
    });
    if (!response.ok) throw new Error("Failed to create alert");
    return response.json();
  },

  // Interventions
  async getInterventions() {
    const response = await fetch(`${API_BASE_URL}/interventions`);
    if (!response.ok) throw new Error("Failed to fetch interventions");
    return response.json();
  },

  async createIntervention(intervention) {
    const response = await fetch(`${API_BASE_URL}/interventions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(intervention),
    });
    if (!response.ok) throw new Error("Failed to create intervention");
    const data = await response.json();
    return { success: true, id: data.id };
  },

  // Machines
  async getMachines() {
    const response = await fetch(`${API_BASE_URL}/machines`);
    if (!response.ok) throw new Error("Failed to fetch machines");
    return response.json();
  },

  async createMachine(machine) {
    const response = await fetch(`${API_BASE_URL}/machines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(machine),
    });
    if (!response.ok) throw new Error("Failed to create machine");
    const data = await response.json();
    return { success: true, id: data.id };
  },

  // Maintenance
  async getMaintenanceSchedule() {
    const response = await fetch(`${API_BASE_URL}/maintenance`);
    if (!response.ok) throw new Error("Failed to fetch maintenance schedule");
    return response.json();
  },

  async createMaintenanceTask(maintenanceData) {
    const response = await fetch(`${API_BASE_URL}/maintenance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(maintenanceData),
    });
    if (!response.ok) throw new Error("Failed to create maintenance task");
    return response.json();
  },

  // Users
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  async createUser(user) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Failed to create user");
    const data = await response.json();
    return { success: true, id: data.id };
  },
};
