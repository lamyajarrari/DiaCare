"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Search } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import apiClient from "@/lib/api-client"
import { useAuth } from "@/hooks/useAuth"

export default function FaultHistoryPage() {
  const [user, setUser] = useState(null)
  const [faults, setFaults] = useState([])
  const [filteredFaults, setFilteredFaults] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "patient") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    loadFaults(parsedUser.patientId)
  }, [router])

  useEffect(() => {
    const filtered = faults.filter(
      (fault) =>
        fault.faultType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fault.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fault.rootCause.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredFaults(filtered)
  }, [faults, searchTerm])

  const loadFaults = async (patientId) => {
    try {
      const faultsData = await apiClient.getFaults(patientId)
      setFaults(faultsData)
      setFilteredFaults(faultsData)
    } catch (error) {
      console.error("Error loading faults:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      ["Date", "Fault Type", "Description", "Downtime", "Root Cause", "Corrective Action", "Status"],
      ...filteredFaults.map((fault) => [
        fault.date,
        fault.faultType,
        fault.description,
        fault.downtime,
        fault.rootCause,
        fault.correctiveAction,
        fault.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "fault-history.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!user || isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={user.role} userName={user.name} />

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Fault History</h1>
          <p className="text-gray-600">Complete record of machine incidents and resolutions</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Fault Records</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search faults..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Button onClick={handleExport} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Fault Type</th>
                    <th className="text-left p-3 font-medium">Description</th>
                    <th className="text-left p-3 font-medium">Downtime</th>
                    <th className="text-left p-3 font-medium">Root Cause</th>
                    <th className="text-left p-3 font-medium">Corrective Action</th>
                    <th className="text-left p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaults.map((fault) => (
                    <tr key={fault.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{fault.date}</td>
                      <td className="p-3 font-medium">{fault.faultType}</td>
                      <td className="p-3">{fault.description}</td>
                      <td className="p-3">{fault.downtime}</td>
                      <td className="p-3">{fault.rootCause}</td>
                      <td className="p-3">{fault.correctiveAction}</td>
                      <td className="p-3">
                        <Badge variant={fault.status === "Resolved" ? "default" : "destructive"}>{fault.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredFaults.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? "No faults match your search criteria" : "No fault records found"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
