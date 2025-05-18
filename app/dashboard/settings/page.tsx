"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DashboardLayout from "@/components/dashboard-layout"

export default function SettingsPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
  })
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    taskReminders: true,
    weeklyDigest: false,
  })
  const [theme, setTheme] = useState("light")
  const [message, setMessage] = useState({ text: "", type: "" })

  useEffect(() => {
    // Load user data from localStorage
    const userInfo = localStorage.getItem("userInfo")
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo)
      setUser({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
      })
    }
  }, [])

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Update user info in localStorage
    const userInfo = localStorage.getItem("userInfo")
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo)
      const updatedUser = { ...parsedUser, name: user.name, email: user.email }
      localStorage.setItem("userInfo", JSON.stringify(updatedUser))

      setMessage({ text: "Profile updated successfully", type: "success" })
      setTimeout(() => setMessage({ text: "", type: "" }), 3000)
    }
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    // In a real app, this would apply the theme to the application
  }

  const handleSaveNotifications = () => {
    // In a real app, this would save to a backend
    setMessage({ text: "Notification preferences saved", type: "success" })
    setTimeout(() => setMessage({ text: "", type: "" }), 3000)
  }

  const handleSaveTheme = () => {
    // In a real app, this would save to a backend
    setMessage({ text: "Theme preferences saved", type: "success" })
    setTimeout(() => setMessage({ text: "", type: "" }), 3000)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and application settings.</p>
      </div>

      {message.text && (
        <Alert variant={message.type === "success" ? "default" : "destructive"} className="mb-6">
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" />
                    <p className="text-sm text-gray-500 mt-1">Leave blank if you don't want to change your password</p>
                  </div>

                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" />
                  </div>
                </div>

                <Button type="submit" className="mt-6">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch checked={notifications.email} onCheckedChange={() => handleNotificationChange("email")} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Browser Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                  </div>
                  <Switch checked={notifications.browser} onCheckedChange={() => handleNotificationChange("browser")} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Task Reminders</h3>
                    <p className="text-sm text-gray-500">Get reminders for upcoming tasks</p>
                  </div>
                  <Switch
                    checked={notifications.taskReminders}
                    onCheckedChange={() => handleNotificationChange("taskReminders")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Weekly Digest</h3>
                    <p className="text-sm text-gray-500">Receive a weekly summary of your tasks</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={() => handleNotificationChange("weeklyDigest")}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div
                      className={`border rounded-md p-4 cursor-pointer ${
                        theme === "light" ? "border-primary bg-primary/10" : ""
                      }`}
                      onClick={() => handleThemeChange("light")}
                    >
                      <div className="h-20 bg-white border rounded-md mb-2"></div>
                      <p className="text-center font-medium">Light</p>
                    </div>
                    <div
                      className={`border rounded-md p-4 cursor-pointer ${
                        theme === "dark" ? "border-primary bg-primary/10" : ""
                      }`}
                      onClick={() => handleThemeChange("dark")}
                    >
                      <div className="h-20 bg-gray-900 border rounded-md mb-2"></div>
                      <p className="text-center font-medium">Dark</p>
                    </div>
                    <div
                      className={`border rounded-md p-4 cursor-pointer ${
                        theme === "system" ? "border-primary bg-primary/10" : ""
                      }`}
                      onClick={() => handleThemeChange("system")}
                    >
                      <div className="h-20 bg-gradient-to-r from-white to-gray-900 border rounded-md mb-2"></div>
                      <p className="text-center font-medium">System</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveTheme}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
