"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, Clock } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import apiClient from "@/lib/api-client"
import { useAuth } from "@/hooks/useAuth"

export default function MaintenancePage() {
  const [user, setUser] = useState(null)
  const [maintenance, setMaintenance] = useState([])
  const [machines, setMachines] = useState([])
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
    loadMaintenanceData()
  }, [router])

  const loadMaintenanceData = async () => {
    try {
      const [maintenanceData, machinesData] = await Promise.all([apiClient.getMaintenanceSchedule(), apiClient.getMachines()])

      setMaintenance(maintenanceData)
      setMachines(machinesData)
    } catch (error) {
      console.error("Error loading maintenance data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMachineName = (machineId) => {
    const machine = machines.find((m) => m.id === machineId)
    return machine ? machine.name : machineId
  }

  const getMaintenanceTasks = (type) => {
    switch (type) {
      case "3-month":
        return ["Replace filters / Clean if necessary", "Check motorized clamps", "Tighten electrical connections"]
      case "6-month":
        return [
          "Full calibration with calibrated tools",
          "Inspect hydraulic components (leaks, corrosion, deposits)",
          "Firmware updates via Fresenius service",
        ]
      case "yearly":
        return [
          "Replace hydraulic seals and pump wheels",
          "Electrical safety tests (ground resistance, leakage current)",
          "Maintenance report update and archiving",
        ]
      default:
        return []
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
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Schedule</h1>
          <p className="text-gray-600">Preventive maintenance plan for Fresenius 4008/6008 dialysis machines</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">3-Month Tasks</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maintenance.filter((m) => m.type === "3-month").length}</div>
              <p className="text-xs text-muted-foreground">Quarterly maintenance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">6-Month Tasks</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maintenance.filter((m) => m.type === "6-month").length}</div>
              <p className="text-xs text-muted-foreground">Semi-annual maintenance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yearly Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maintenance.filter((m) => m.type === "yearly").length}</div>
              <p className="text-xs text-muted-foreground">Annual maintenance</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenance.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{getMachineName(item.machineId)}</h3>
                          <Badge variant="outline">{item.type}</Badge>
                          <Badge variant={item.status === "Pending" ? "destructive" : "default"}>{item.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Due Date:</strong> {item.dueDate}
                        </p>
                        <div className="text-sm text-gray-600">
                          <strong>Tasks:</strong>
                          <ul className="list-disc list-inside mt-1 ml-4">
                            {getMaintenanceTasks(item.type).map((task, index) => (
                              <li key={index}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Mark Complete
                        </Button>
                        <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                          Start Maintenance
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {maintenance.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No maintenance tasks scheduled</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">Every 3 Months</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Replace filters / Clean if necessary</li>
                    <li>• Check motorized clamps</li>
                    <li>• Tighten electrical connections</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-600 mb-2">Every 6 Months</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Full calibration with calibrated tools</li>
                    <li>• Inspect hydraulic components</li>
                    <li>• Firmware updates via Fresenius service</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Once a Year</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Replace hydraulic seals and pump wheels</li>
                    <li>• Electrical safety tests</li>
                    <li>• Maintenance report update and archiving</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
