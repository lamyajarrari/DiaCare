"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Navbar({ userRole, userName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    router.push("/login")
  }

  const getNavLinks = () => {
    switch (userRole) {
      case "patient":
        return [
          { href: "/dashboard/patient", label: "Dashboard" },
          { href: "/dashboard/patient/faults", label: "Fault History" },
        ]
      case "technician":
        return [
          { href: "/dashboard/technician", label: "Dashboard" },
          { href: "/dashboard/technician/alerts", label: "Alerts" },
          { href: "/dashboard/technician/interventions", label: "Interventions" },
          { href: "/dashboard/technician/maintenance", label: "Maintenance" },
        ]
      case "admin":
        return [
          { href: "/dashboard/admin", label: "Dashboard" },
          { href: "/dashboard/admin/users", label: "Users" },
          { href: "/dashboard/admin/machines", label: "Machines" },
          { href: "/dashboard/admin/reports", label: "Reports" },
        ]
      default:
        return []
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/${userRole}`} className="flex items-center space-x-2">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <Image
                src="/logo.png"       // Assure-toi que ce fichier existe dans /public
                alt="DiaCare Logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          </Link>

          <div className="hidden md:flex space-x-6">
            {getNavLinks().map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>

          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm text-gray-600">Welcome, {userName}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
          <div className="flex flex-col space-y-2">
            {getNavLinks().map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <span className="text-sm text-gray-600 block py-1">Welcome, {userName}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start p-0">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
