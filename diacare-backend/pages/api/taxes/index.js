import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { isActive, type } = req.query
      
      const where = {}
      if (isActive !== undefined) where.isActive = isActive === 'true'
      if (type) where.type = type

      const taxes = await prisma.taxe.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        }
      })
      res.status(200).json(taxes)
    } catch (error) {
      console.error("Error fetching taxes:", error)
      res.status(500).json({ error: "Erreur lors de la récupération des taxes" })
    }
  }

  else if (req.method === "POST") {
    const { name, description, amount, type, isActive } = req.body

    if (!name || !amount || !type) {
      return res.status(400).json({ error: "Champs manquants" })
    }

    try {
      const newTaxe = await prisma.taxe.create({
        data: {
          name,
          description: description || "",
          amount: parseFloat(amount),
          type,
          isActive: isActive !== undefined ? isActive : true,
        }
      })
      res.status(201).json(newTaxe)
    } catch (error) {
      console.error("Error creating taxe:", error)
      res.status(500).json({ error: "Erreur lors de la création de la taxe" })
    }
  }

  else if (req.method === "PUT") {
    const { id, name, description, amount, type, isActive } = req.body

    if (!id) {
      return res.status(400).json({ error: "ID requis" })
    }

    try {
      const updateData = {}
      if (name) updateData.name = name
      if (description !== undefined) updateData.description = description
      if (amount) updateData.amount = parseFloat(amount)
      if (type) updateData.type = type
      if (isActive !== undefined) updateData.isActive = isActive

      const updatedTaxe = await prisma.taxe.update({
        where: { id: parseInt(id) },
        data: updateData
      })
      res.status(200).json(updatedTaxe)
    } catch (error) {
      console.error("Error updating taxe:", error)
      res.status(500).json({ error: "Erreur lors de la mise à jour de la taxe" })
    }
  }

  else if (req.method === "DELETE") {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ error: "ID requis" })
    }

    try {
      await prisma.taxe.delete({
        where: { id: parseInt(id) }
      })
      res.status(200).json({ message: "Taxe supprimée avec succès" })
    } catch (error) {
      console.error("Error deleting taxe:", error)
      res.status(500).json({ error: "Erreur lors de la suppression de la taxe" })
    }
  }

  else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"])
    res.status(405).end(`Méthode ${req.method} non autorisée`)
  }
} 