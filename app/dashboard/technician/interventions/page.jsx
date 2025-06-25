"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, FileText } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import apiClient from "@/lib/api-client"
import { useAuth } from "@/hooks/useAuth"

export default function InterventionsPage() {
  const [user, setUser] = useState(null)
  const [interventions, setInterventions] = useState([])
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
    loadInterventions()
  }, [router])

  const loadInterventions = async () => {
    try {
      const interventionsData = await apiClient.getInterventions()
      setInterventions(interventionsData)
    } catch (error) {
      console.error("Error loading interventions:", error)
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interventions</h1>
            <p className="text-gray-600">Manage technical intervention reports and history</p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/technician/interventions/new")}
            className="bg-teal-500 hover:bg-teal-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Intervention
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Intervention History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interventions.map((intervention) => (
                <div key={intervention.id} className="border rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{intervention.equipmentDescription}</h3>
                        <Badge variant={intervention.interventionType === "Preventive" ? "default" : "secondary"}>
                          {intervention.interventionType}
                        </Badge>
                        <Badge variant={intervention.status === "Completed" ? "default" : "destructive"}>
                          {intervention.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>
                          <strong>Request Date:</strong> {intervention.requestDate}
                        </p>
                        <p>
                          <strong>Department:</strong> {intervention.department}
                        </p>
                        <p>
                          <strong>Requested By:</strong> {intervention.requestedBy}
                        </p>
                        <p>
                          <strong>Technician:</strong> {intervention.technician}
                        </p>
                        <p>
                          <strong>Time Spent:</strong> {intervention.timeSpent} hours
                        </p>
                        <p>
                          <strong>Parts Replaced:</strong> {intervention.partsReplaced}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Problem:</strong> {intervention.problemDescription}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Tasks:</strong> {intervention.tasksCompleted}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View Report
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {interventions.length === 0 && (
                <div className="text-center py-8 text-gray-500">No interventions recorded yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
