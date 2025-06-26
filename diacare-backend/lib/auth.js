import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
  } catch (error) {
    return null
  }
}

export async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Token d'authentification requis" })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(401).json({ error: "Token invalide" })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(500).json({ error: "Erreur d'authentification" })
  }
}

export function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentification requise" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Accès non autorisé" })
    }

    next()
  }
} 