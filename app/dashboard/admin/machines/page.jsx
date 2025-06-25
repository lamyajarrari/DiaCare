"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import apiClient from "@/lib/api-client"
import { useAuth } from "@/hooks/useAuth"

export default function MachinesPage() {
  const [machines, setMachines] = useState([])
  const [filteredMachines, setFilteredMachines] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newMachine, setNewMachine] = useState({
    id: "",
    name: "",
    inventoryNumber: "",
    department: "",
    status: "Active",
  })
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

    loadMachines()
  }, [router, isAuthenticated, hasRole])

  useEffect(() => {
    let filtered = machines

    if (searchTerm) {
      filtered = filtered.filter(
        (machine) =>
          machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          machine.inventoryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          machine.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((machine) => machine.status === statusFilter)
    }

    setFilteredMachines(filtered)
  }, [machines, searchTerm, statusFilter])

  const loadMachines = async () => {
    try {
      const machinesData = await apiClient.getMachines()
      setMachines(machinesData)
      setFilteredMachines(machinesData)
    } catch (error) {
      console.error("Error loading machines:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateMachine = async (e) => {
    e.preventDefault()
    try {
      await apiClient.createMachine(newMachine)
      setIsDialogOpen(false)
      setNewMachine({ id: "", name: "", inventoryNumber: "", department: "", status: "Active" })
      loadMachines()
    } catch (error) {
      console.error("Error creating machine:", error)
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Active":
        return "default"
      case "Maintenance":
        return "secondary"
      case "Inactive":
        return "destructive"
      default:
        return "outline"
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
            <h1 className="text-3xl font-bold text-gray-900">Machine Management</h1>
            <p className="text-gray-600">Manage dialysis machines and their status</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-500 hover:bg-teal-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Machine
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Machine</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateMachine} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Machine ID</Label>
                  <Input
                    id="id"
                    value={newMachine.id}
                    onChange={(e) => setNewMachine({ ...newMachine, id: e.target.value })}
                    required
                    placeholder="M001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Machine Name</Label>
                  <Input
                    id="name"
                    value={newMachine.name}
                    onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
                    required
                    placeholder="Fresenius 4008S"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inventoryNumber">Inventory Number</Label>
                  <Input
                    id="inventoryNumber"
                    value={newMachine.inventoryNumber}
                    onChange={(e) => setNewMachine({ ...newMachine, inventoryNumber: e.target.value })}
                    required
                    placeholder="INV-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={newMachine.department}
                    onChange={(e) => setNewMachine({ ...newMachine, department: e.target.value })}
                    required
                    placeholder="Dialysis Unit A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newMachine.status} onValueChange={(value) => setNewMachine({ ...newMachine, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                    Add Machine
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <CardTitle>Dialysis Machines</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search machines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMachines.map((machine) => (
                <div
                  key={machine.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium">{machine.name}</h3>
                      <p className="text-sm text-gray-500">ID: {machine.id} | {machine.inventoryNumber}</p>
                      <p className="text-sm text-gray-500">{machine.department}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(machine.status)}>
                      {machine.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
