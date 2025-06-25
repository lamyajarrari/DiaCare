"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/useAuth"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (result.user) {
        router.push(`/dashboard/${result.user.role}`)
      }
    } catch (err) {
      // Error is handled by the useAuth hook
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          {/* Conteneur du logo - taille très grande */}
          <div className="mx-auto w-48 h-48 flex items-center justify-center"> {/* 192px × 192px */}
            <Image 
              src="/logo.png"
              alt="DiaCare Logo"
              width={192}  // Taille augmentée
              height={192}
              quality={100}
              priority
              className="object-contain"
            />
          </div>
          
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Test credentials */}
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Test credentials:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Patient:</strong> patient@diacare.com / password123</p>
              <p><strong>Technician:</strong> tech@diacare.com / password123</p>
              <p><strong>Admin:</strong> admin@diacare.com / password123</p>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </div>
  )
}