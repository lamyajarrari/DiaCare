import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { machineId, status, priority, type } = req.query
      
      const where = {}
      if (machineId) where.machineId = machineId
      if (status) where.status = status
      if (priority) where.priority = priority
      if (type) where.type = type

      const alerts = await prisma.alert.findMany({
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
          timestamp: 'desc'
        }
      })
      res.status(200).json(alerts)
    } catch (error) {
      console.error("Error fetching alerts:", error)
      res.status(500).json({ error: "Erreur lors de la récupération des alertes" })
    }
  }

  else if (req.method === "POST") {
    const { 
      message, 
      messageRole, 
      type, 
      requiredAction, 
      priority, 
      machineId, 
      status 
    } = req.body

    if (!message || !type || !machineId) {
      return res.status(400).json({ error: "Champs manquants" })
    }

    try {
      const newAlert = await prisma.alert.create({
        data: {
          message,
          messageRole: messageRole || "",
          type,
          requiredAction: requiredAction || "",
          priority: priority || "medium",
          status: status || "active",
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
      res.status(201).json(newAlert)
    } catch (error) {
      console.error("Error creating alert:", error)
      res.status(500).json({ error: "Erreur lors de la création de l'alerte" })
    }
  }

  else if (req.method === "PUT") {
    const { id, status } = req.body

    if (!id || !status) {
      return res.status(400).json({ error: "ID et statut requis" })
    }

    try {
      const updatedAlert = await prisma.alert.update({
        where: { id: parseInt(id) },
        data: { status },
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
      res.status(200).json(updatedAlert)
    } catch (error) {
      console.error("Error updating alert:", error)
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'alerte" })
    }
  }

  else {
    res.setHeader("Allow", ["GET", "POST", "PUT"])
    res.status(405).end(`Méthode ${req.method} non autorisée`)
  }
} 