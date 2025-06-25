import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { technicianId, status, interventionType } = req.query
      
      const where = {}
      if (technicianId) where.technicianId = technicianId
      if (status) where.status = status
      if (interventionType) where.interventionType = interventionType

      const interventions = await prisma.intervention.findMany({
        where,
        include: {
          technician: {
            select: {
              id: true,
              name: true,
              email: true,
              technicianId: true
            }
          }
        },
        orderBy: {
          requestDate: 'desc'
        }
      })
      res.status(200).json(interventions)
    } catch (error) {
      console.error("Error fetching interventions:", error)
      res.status(500).json({ error: "Erreur lors de la récupération des interventions" })
    }
  }

  else if (req.method === "POST") {
    const { 
      requestDate,
      requestedIntervention,
      arrivalAtWorkshop,
      department,
      requestedBy,
      returnToService,
      equipmentDescription,
      inventoryNumber,
      problemDescription,
      interventionType,
      datePerformed,
      tasksCompleted,
      partsReplaced,
      partDescription,
      price,
      technician,
      timeSpent,
      status,
      technicianId
    } = req.body

    if (!requestDate || !requestedIntervention || !department || !requestedBy || 
        !equipmentDescription || !inventoryNumber || !problemDescription || 
        !interventionType || !technician || !technicianId) {
      return res.status(400).json({ error: "Champs manquants" })
    }

    try {
      const newIntervention = await prisma.intervention.create({
        data: {
          requestDate: new Date(requestDate),
          requestedIntervention,
          arrivalAtWorkshop: arrivalAtWorkshop ? new Date(arrivalAtWorkshop) : null,
          department,
          requestedBy,
          returnToService: returnToService ? new Date(returnToService) : null,
          equipmentDescription,
          inventoryNumber,
          problemDescription,
          interventionType,
          datePerformed: datePerformed ? new Date(datePerformed) : null,
          tasksCompleted: tasksCompleted || "",
          partsReplaced: partsReplaced ? parseInt(partsReplaced) : null,
          partDescription: partDescription || "",
          price: price ? parseFloat(price) : null,
          technician,
          timeSpent: timeSpent ? parseInt(timeSpent) : null,
          status: status || "Pending",
          technicianId,
        },
        include: {
          technician: {
            select: {
              id: true,
              name: true,
              email: true,
              technicianId: true
            }
          }
        }
      })
      res.status(201).json(newIntervention)
    } catch (error) {
      console.error("Error creating intervention:", error)
      res.status(500).json({ error: "Erreur lors de la création de l'intervention" })
    }
  }

  else if (req.method === "PUT") {
    const { id, ...updateData } = req.body

    if (!id) {
      return res.status(400).json({ error: "ID requis" })
    }

    try {
      // Convert date strings to Date objects if they exist
      if (updateData.requestDate) updateData.requestDate = new Date(updateData.requestDate)
      if (updateData.arrivalAtWorkshop) updateData.arrivalAtWorkshop = new Date(updateData.arrivalAtWorkshop)
      if (updateData.returnToService) updateData.returnToService = new Date(updateData.returnToService)
      if (updateData.datePerformed) updateData.datePerformed = new Date(updateData.datePerformed)
      
      // Convert numeric fields
      if (updateData.partsReplaced) updateData.partsReplaced = parseInt(updateData.partsReplaced)
      if (updateData.price) updateData.price = parseFloat(updateData.price)
      if (updateData.timeSpent) updateData.timeSpent = parseInt(updateData.timeSpent)

      const updatedIntervention = await prisma.intervention.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          technician: {
            select: {
              id: true,
              name: true,
              email: true,
              technicianId: true
            }
          }
        }
      })
      res.status(200).json(updatedIntervention)
    } catch (error) {
      console.error("Error updating intervention:", error)
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'intervention" })
    }
  }

  else {
    res.setHeader("Allow", ["GET", "POST", "PUT"])
    res.status(405).end(`Méthode ${req.method} non autorisée`)
  }
} 