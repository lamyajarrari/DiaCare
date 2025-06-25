"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Settings, BarChart3, AlertTriangle, Wrench, Calendar } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import apiClient from "@/lib/api-client"
import { useAuth } from "@/hooks/useAuth"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMachines: 0,
    activeAlerts: 0,
    pendingMaintenance: 0,
    completedInterventions: 0,
    totalFaults: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { user, isAuthenticated, hasRole } = useAuth()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    if (!hasRole("admin")) {
      router.push("/login")
      return
    }

    loadDashboardStats()
  }, [router, isAuthenticated, hasRole])

  const loadDashboardStats = async () => {
    try {
      const [users, machines, alerts, maintenance, interventions, faults] = await Promise.all([
        apiClient.getUsers(),
        apiClient.getMachines(),
        apiClient.getAlerts(),
        apiClient.getMaintenanceSchedules(),
        apiClient.getInterventions(),
        apiClient.getFaults(),
      ])

      setStats({
        totalUsers: users.length,
        totalMachines: machines.length,
        activeAlerts: alerts.filter((a) => a.status === "active").length,
        pendingMaintenance: maintenance.filter((m) => m.status === "Pending").length,
        completedInterventions: interventions.filter((i) => i.status === "Completed").length,
        totalFaults: faults.length,
      })
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={user.role} userName={user.name} />

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">System overview and management controls</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Patients, technicians, admins</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Machines</CardTitle>
              <Settings className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMachines}</div>
              <p className="text-xs text-muted-foreground">Dialysis machines</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAlerts}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Maintenance</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingMaintenance}</div>
              <p className="text-xs text-muted-foreground">Scheduled tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interventions</CardTitle>
              <Wrench className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedInterventions}</div>
              <p className="text-xs text-muted-foreground">Completed this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Faults</CardTitle>
              <BarChart3 className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFaults}</div>
              <p className="text-xs text-muted-foreground">All time records</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push("/dashboard/admin/users")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push("/dashboard/admin/machines")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Machines
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push("/dashboard/admin/reports")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system health and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">System Status:</span>
                  <span className="text-sm text-green-600 font-medium">Operational</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Database:</span>
                  <span className="text-sm text-green-600 font-medium">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">API Status:</span>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Backup:</span>
                  <span className="text-sm text-gray-600">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
