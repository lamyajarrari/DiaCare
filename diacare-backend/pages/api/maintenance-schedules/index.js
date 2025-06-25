import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { machineId, status, type } = req.query
      
      const where = {}
      if (machineId) where.machineId = machineId
      if (status) where.status = status
      if (type) where.type = type

      const maintenanceSchedules = await prisma.maintenanceSchedule.findMany({
        where,
        include: {
          machine: {
            select: {
              id: true,
              name: true,
              inventoryNumber: true,
              department: true
            }
          }
        },
        orderBy: {
          dueDate: 'asc'
        }
      })
      res.status(200).json(maintenanceSchedules)
    } catch (error) {
      console.error("Error fetching maintenance schedules:", error)
      res.status(500).json({ error: "Erreur lors de la récupération des plannings de maintenance" })
    }
  }

  else if (req.method === "POST") {
    const { type, tasks, dueDate, status, machineId } = req.body

    if (!type || !tasks || !dueDate || !machineId) {
      return res.status(400).json({ error: "Champs manquants" })
    }

    try {
      const newMaintenanceSchedule = await prisma.maintenanceSchedule.create({
        data: {
          type,
          tasks: Array.isArray(tasks) ? tasks : [tasks],
          dueDate: new Date(dueDate),
          status: status || "Pending",
          machineId,
        },
        include: {
          machine: {
            select: {
              id: true,
              name: true,
              inventoryNumber: true,
              department: true
            }
          }
        }
      })
      res.status(201).json(newMaintenanceSchedule)
    } catch (error) {
      console.error("Error creating maintenance schedule:", error)
      res.status(500).json({ error: "Erreur lors de la création du planning de maintenance" })
    }
  }

  else if (req.method === "PUT") {
    const { id, status, dueDate, tasks } = req.body

    if (!id) {
      return res.status(400).json({ error: "ID requis" })
    }

    try {
      const updateData = {}
      if (status) updateData.status = status
      if (dueDate) updateData.dueDate = new Date(dueDate)
      if (tasks) updateData.tasks = Array.isArray(tasks) ? tasks : [tasks]

      const updatedMaintenanceSchedule = await prisma.maintenanceSchedule.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          machine: {
            select: {
              id: true,
              name: true,
              inventoryNumber: true,
              department: true
            }
          }
        }
      })
      res.status(200).json(updatedMaintenanceSchedule)
    } catch (error) {
      console.error("Error updating maintenance schedule:", error)
      res.status(500).json({ error: "Erreur lors de la mise à jour du planning de maintenance" })
    }
  }

  else {
    res.setHeader("Allow", ["GET", "POST", "PUT"])
    res.status(405).end(`Méthode ${req.method} non autorisée`)
  }
} 