"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { api } from "@/lib/api"

export default function NewInterventionPage() {
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    requestDate: "",
    requestedIntervention: "",
    arrivalAtWorkshop: "",
    department: "",
    requestedBy: "",
    returnToService: "",
    equipmentDescription: "",
    inventoryNumber: "",
    problemDescription: "",
    interventionType: "",
    datePerformed: "",
    tasksCompleted: "",
    partsReplaced: "",
    partDescription: "",
    price: "",
    timeSpent: "",
  })
  const [isLoading, setIsLoading] = useState(false)
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
  }, [router])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const interventionData = {
        ...formData,
        technician: user.name,
        status: "Completed",
      }

      await api.createIntervention(interventionData)
      router.push("/dashboard/technician/interventions")
    } catch (error) {
      console.error("Error creating intervention:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={user.role} userName={user.name} />

      <div className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Intervention Report</h1>
            <p className="text-gray-600">Fill out the technical intervention form</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Intervention Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="requestDate">Request Date</Label>
                  <Input
                    id="requestDate"
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => handleInputChange("requestDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="requestedIntervention">Requested Intervention</Label>
                  <Input
                    id="requestedIntervention"
                    value={formData.requestedIntervention}
                    onChange={(e) => handleInputChange("requestedIntervention", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="arrivalAtWorkshop">Arrival at Workshop</Label>
                  <Input
                    id="arrivalAtWorkshop"
                    type="date"
                    value={formData.arrivalAtWorkshop}
                    onChange={(e) => handleInputChange("arrivalAtWorkshop", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select onValueChange={(value) => handleInputChange("department", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dialysis Unit A">Dialysis Unit A</SelectItem>
                      <SelectItem value="Dialysis Unit B">Dialysis Unit B</SelectItem>
                      <SelectItem value="Dialysis Unit C">Dialysis Unit C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="requestedBy">Requested By</Label>
                  <Input
                    id="requestedBy"
                    value={formData.requestedBy}
                    onChange={(e) => handleInputChange("requestedBy", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="returnToService">Return to Service</Label>
                  <Input
                    id="returnToService"
                    type="date"
                    value={formData.returnToService}
                    onChange={(e) => handleInputChange("returnToService", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="equipmentDescription">Equipment Description</Label>
                  <Input
                    id="equipmentDescription"
                    value={formData.equipmentDescription}
                    onChange={(e) => handleInputChange("equipmentDescription", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="inventoryNumber">Inventory Number</Label>
                  <Input
                    id="inventoryNumber"
                    value={formData.inventoryNumber}
                    onChange={(e) => handleInputChange("inventoryNumber", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="problemDescription">Problem Description</Label>
                <Textarea
                  id="problemDescription"
                  value={formData.problemDescription}
                  onChange={(e) => handleInputChange("problemDescription", e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label>Type of Intervention</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="preventive"
                      checked={formData.interventionType === "Preventive"}
                      onCheckedChange={(checked) => handleInputChange("interventionType", checked ? "Preventive" : "")}
                    />
                    <Label htmlFor="preventive">Preventive</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="curative"
                      checked={formData.interventionType === "Curative"}
                      onCheckedChange={(checked) => handleInputChange("interventionType", checked ? "Curative" : "")}
                    />
                    <Label htmlFor="curative">Curative</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="datePerformed">Date Performed</Label>
                  <Input
                    id="datePerformed"
                    type="date"
                    value={formData.datePerformed}
                    onChange={(e) => handleInputChange("datePerformed", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="timeSpent">Time Spent (hours)</Label>
                  <Input
                    id="timeSpent"
                    type="number"
                    value={formData.timeSpent}
                    onChange={(e) => handleInputChange("timeSpent", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tasksCompleted">Tasks Completed</Label>
                <Textarea
                  id="tasksCompleted"
                  value={formData.tasksCompleted}
                  onChange={(e) => handleInputChange("tasksCompleted", e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partsReplaced">Quantity Parts Replaced</Label>
                  <Input
                    id="partsReplaced"
                    type="number"
                    value={formData.partsReplaced}
                    onChange={(e) => handleInputChange("partsReplaced", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (MAD)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="partDescription">Description and Provenance of Parts</Label>
                <Textarea
                  id="partDescription"
                  value={formData.partDescription}
                  onChange={(e) => handleInputChange("partDescription", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-teal-500 hover:bg-teal-600">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Intervention"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
