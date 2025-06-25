"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Wrench, Calendar, Bell } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import apiClient from "@/lib/api-client"
import { useAuth } from "@/hooks/useAuth"

export default function TechnicianDashboard() {
  const [alerts, setAlerts] = useState([])
  const [interventions, setInterventions] = useState([])
  const [maintenance, setMaintenance] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { user, isAuthenticated, hasRole } = useAuth()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    if (!hasRole("technician")) {
      router.push("/login")
      return
    }

    loadDashboardData()
  }, [router, isAuthenticated, hasRole])

  const loadDashboardData = async () => {
    try {
      const [alertsData, interventionsData, maintenanceData] = await Promise.all([
        apiClient.getAlerts(),
        apiClient.getInterventions(),
        apiClient.getMaintenanceSchedule(),
      ])

      setAlerts(alertsData)
      setInterventions(interventionsData)
      setMaintenance(maintenanceData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  const activeAlerts = alerts.filter((a) => a.status === "active")
  const pendingMaintenance = maintenance.filter((m) => m.status === "Pending")
  const completedInterventions = interventions.filter((i) => i.status === "Completed")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={user.role} userName={user.name} />

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Technician Dashboard</h1>
          <p className="text-gray-600">Monitor alerts, manage interventions, and track maintenance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interventions</CardTitle>
              <Wrench className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedInterventions.length}</div>
              <p className="text-xs text-muted-foreground">Completed this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Maintenance</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingMaintenance.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Latest machine alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-gray-600">{alert.type}</p>
                    </div>
                    <Badge variant={alert.priority === "high" ? "destructive" : "secondary"}>{alert.priority}</Badge>
                  </div>
                ))}
                {activeAlerts.length === 0 && <p className="text-gray-500 text-center py-4">No active alerts</p>}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push("/dashboard/technician/alerts")}
              >
                View All Alerts
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance</CardTitle>
              <CardDescription>Scheduled preventive maintenance tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingMaintenance.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.type} Maintenance</p>
                      <p className="text-sm text-gray-600">Due: {item.dueDate}</p>
                    </div>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                ))}
                {pendingMaintenance.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No pending maintenance</p>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push("/dashboard/technician/maintenance")}
              >
                View Maintenance Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
