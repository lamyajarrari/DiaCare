"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, CheckCircle } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import apiClient from "@/lib/api-client"
import { useAuth } from "@/hooks/useAuth"

export default function AlertsPage() {
  const [user, setUser] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [filteredAlerts, setFilteredAlerts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "technician") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    loadAlerts()
  }, [router])

  useEffect(() => {
    let filtered = alerts

    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.requiredAction.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((alert) => alert.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((alert) => alert.priority === priorityFilter)
    }

    setFilteredAlerts(filtered)
  }, [alerts, searchTerm, statusFilter, priorityFilter])

  const loadAlerts = async () => {
    try {
      const alertsData = await apiClient.getAlerts()
      setAlerts(alertsData)
      setFilteredAlerts(alertsData)
    } catch (error) {
      console.error("Error loading alerts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResolveAlert = async (alertId) => {
    try {
      await apiClient.updateAlertStatus(alertId, "resolved")
      // Update local state
      setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" } : alert)))
    } catch (error) {
      console.error("Error resolving alert:", error)
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
          <h1 className="text-3xl font-bold text-gray-900">Alert Center</h1>
          <p className="text-gray-600">Monitor and respond to real-time machine alerts</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <CardTitle>Active Alerts</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-48"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{alert.message}</h3>
                        <Badge
                          variant={
                            alert.priority === "high"
                              ? "destructive"
                              : alert.priority === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {alert.priority}
                        </Badge>
                        <Badge variant={alert.status === "active" ? "destructive" : "default"}>{alert.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Type:</strong> {alert.type}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Role:</strong> {alert.messageRole}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Required Action:</strong> {alert.requiredAction}
                      </p>
                      <p className="text-xs text-gray-500">
                        Machine: {alert.machineId} • {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {alert.status === "active" && (
                        <Button
                          size="sm"
                          onClick={() => handleResolveAlert(alert.id)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredAlerts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                    ? "No alerts match your filters"
                    : "No alerts found"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
