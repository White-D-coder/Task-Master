"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, CheckSquare, Calendar, Settings, LogOut, Menu, X, User, Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    // Get user info from localStorage
    const userInfo = localStorage.getItem("userInfo")
    if (userInfo) {
      setUser(JSON.parse(userInfo))
    } else {
      // For demo purposes, set a default user
      setUser({ name: "Demo User" })
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userInfo")
    router.push("/login")
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/dashboard/tasks", label: "Tasks", icon: <CheckSquare className="h-5 w-5" /> },
    { href: "/dashboard/calendar", label: "Calendar", icon: <Calendar className="h-5 w-5" /> },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.name) return "U"
    return user.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation - Desktop */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 bg-white border-r border-gray-200 min-h-screen">
        <div className="flex items-center justify-center h-16 lg:justify-start lg:px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 hidden lg:block">TaskMaster</h1>
          <span className="text-xl font-bold text-gray-900 lg:hidden">TM</span>
        </div>

        <nav className="flex-1 pt-5 px-3">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    className={`w-full ${pathname === item.href ? "bg-primary text-primary-foreground" : ""} ${
                      pathname === item.href ? "lg:justify-start" : "lg:justify-start"
                    } justify-center h-12`}
                  >
                    {item.icon}
                    <span className="ml-3 hidden lg:inline">{item.label}</span>
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 mt-auto">
          <Button variant="outline" className="w-full justify-center lg:justify-start" onClick={handleLogout}>
            <LogOut className="h-5 w-5 lg:mr-2" />
            <span className="hidden lg:inline">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Navigation Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden transition duration-200 ease-in-out z-50 w-64 bg-white border-r border-gray-200`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">TaskMaster</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 pt-5 px-3">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant={pathname === item.href ? "default" : "ghost"} className="w-full justify-start h-12">
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 mt-auto">
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
