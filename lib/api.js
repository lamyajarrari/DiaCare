import mockData from "@/data/mock-data.json"

// Mock API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  // Auth
  async login(email, password) {
    await delay(500)
    const user = mockData.users.find((u) => u.email === email && u.password === password)
    if (user) {
      return { success: true, user: { ...user, password: undefined } }
    }
    return { success: false, error: "Invalid credentials" }
  },

  // Faults
  async getFaults(patientId) {
    await delay(300)
    if (patientId) {
      return mockData.faults.filter((f) => f.patientId === patientId)
    }
    return mockData.faults
  },

  // Alerts
  async getAlerts() {
    await delay(300)
    return mockData.alerts
  },

  async updateAlertStatus(alertId, status) {
    await delay(300)
    return { success: true }
  },

  // Interventions
  async getInterventions() {
    await delay(300)
    return mockData.interventions
  },

  async createIntervention(intervention) {
    await delay(500)
    return { success: true, id: Date.now() }
  },

  // Machines
  async getMachines() {
    await delay(300)
    return mockData.machines
  },

  async createMachine(machine) {
    await delay(500)
    return { success: true, id: `M${Date.now()}` }
  },

  // Maintenance
  async getMaintenanceSchedule() {
    await delay(300)
    return mockData.maintenanceSchedule
  },

  // Users
  async getUsers() {
    await delay(300)
    return mockData.users.map((u) => ({ ...u, password: undefined }))
  },

  async createUser(user) {
    await delay(500)
    return { success: true, id: Date.now() }
  },
}
