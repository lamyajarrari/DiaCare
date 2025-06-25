import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { patientId, machineId, status } = req.query
      
      const where = {}
      if (patientId) where.patientId = patientId
      if (machineId) where.machineId = machineId
      if (status) where.status = status

      const faults = await prisma.fault.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
              patientId: true
            }
          },
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
          date: 'desc'
        }
      })
      res.status(200).json(faults)
    } catch (error) {
      console.error("Error fetching faults:", error)
      res.status(500).json({ error: "Erreur lors de la récupération des pannes" })
    }
  }

  else if (req.method === "POST") {
    const { 
      date, 
      faultType, 
      description, 
      downtime, 
      rootCause, 
      correctiveAction, 
      status, 
      patientId, 
      machineId 
    } = req.body

    if (!date || !faultType || !description || !patientId || !machineId) {
      return res.status(400).json({ error: "Champs manquants" })
    }

    try {
      const newFault = await prisma.fault.create({
        data: {
          date: new Date(date),
          faultType,
          description,
          downtime: downtime || "",
          rootCause: rootCause || "",
          correctiveAction: correctiveAction || "",
          status: status || "Open",
          patientId,
          machineId,
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
              patientId: true
            }
          },
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
      res.status(201).json(newFault)
    } catch (error) {
      console.error("Error creating fault:", error)
      res.status(500).json({ error: "Erreur lors de la création de la panne" })
    }
  }

  else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Méthode ${req.method} non autorisée`)
  }
} 