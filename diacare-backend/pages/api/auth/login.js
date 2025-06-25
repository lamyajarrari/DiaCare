import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Méthode ${req.method} non autorisée`)
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" })
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" })
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        patientId: user.patientId,
        technicianId: user.technicianId,
        adminId: user.adminId
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    res.status(200).json({
      message: "Connexion réussie",
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Erreur lors de la connexion" })
  }
} 