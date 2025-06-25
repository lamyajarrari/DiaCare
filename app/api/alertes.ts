import type { NextApiRequest, NextApiResponse } from "next"
import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const client = twilio(accountSid, authToken)

type Alert = {
  id: number
  message: string
  priority: string
  machineId: string
  timestamp: string
}

let fakeDatabase: Alert[] = []

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { message, priority, machineId } = req.body

    if (!message || !priority || !machineId) {
      return res.status(400).json({ error: "Missing fields" })
    }

    const newAlert: Alert = {
      id: Date.now(),
      message,
      priority,
      machineId,
      timestamp: new Date().toISOString(),
    }

    fakeDatabase.push(newAlert)

    try {
      await client.messages.create({
        body: `🚨 ALERTE: ${message}\n📍 Machine: ${machineId}\n⚠️ Priorité: ${priority}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.TECHNICIEN_PHONE!,
      })
      res.status(201).json({ success: true, alert: newAlert })
    } catch (error) {
      console.error("SMS error:", error)
      res.status(500).json({ error: "Erreur lors de l'envoi du SMS" })
    }
  } else if (req.method === "GET") {
    res.status(200).json(fakeDatabase)
  } else {
    res.status(405).json({ error: "Méthode non autorisée" })
  }
}
