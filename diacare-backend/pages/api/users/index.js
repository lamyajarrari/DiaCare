import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany()
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" })
    }
  }

  else if (req.method === "POST") {
    const { name, email, role, password } = req.body

    if (!name || !email || !role || !password) {
      return res.status(400).json({ error: "Champs manquants" })
    }

    try {
      // Hashage du mot de passe avec un salt de 10 rounds
      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          role,
          password: hashedPassword,
        }
      })
      res.status(201).json(newUser)
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" })
    }
  }

  else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Méthode ${req.method} non autorisée`)
  }
}
