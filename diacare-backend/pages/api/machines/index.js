import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const machines = await prisma.machine.findMany({
        include: {
          faults: true,
          alerts: true,
          interventions: true,
          maintenanceSchedules: true
        }
      })
      res.status(200).json(machines)
    } catch (error) {
      console.error("Error fetching machines:", error)
      res.status(500).json({ error: "Erreur lors de la récupération des machines" })
    }
  }

  else if (req.method === "POST") {
    const { id, name, inventoryNumber, department, status, lastMaintenance, nextMaintenance } = req.body

    if (!id || !name || !inventoryNumber || !department) {
      return res.status(400).json({ error: "Champs manquants" })
    }

    try {
      const newMachine = await prisma.machine.create({
        data: {
          id,
          name,
          inventoryNumber,
          department,
          status: status || "Active",
          lastMaintenance: lastMaintenance ? new Date(lastMaintenance) : null,
          nextMaintenance: nextMaintenance ? new Date(nextMaintenance) : null,
        }
      })
      res.status(201).json(newMachine)
    } catch (error) {
      console.error("Error creating machine:", error)
      res.status(500).json({ error: "Erreur lors de la création de la machine" })
    }
  }

  else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Méthode ${req.method} non autorisée`)
  }
} 