"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, Search } from "lucide-react"
import TaskList from "@/components/task-list"
import TaskForm from "@/components/task-form"
import type { Task } from "@/lib/types"
import { fetchTasks } from "@/lib/mock-api"
import DashboardLayout from "@/components/dashboard-layout"

export default function Dashboard() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    search: "",
    date: null as Date | null,
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    loadTasks()
  }, [router])

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      const fetchedTasks = await fetchTasks()
      setTasks(fetchedTasks)
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to load tasks")
      if (err.status === 401) {
        localStorage.removeItem("token")
        router.push("/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask])
    setShowTaskForm(false)
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)))
  }

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId))
  }

  const filteredTasks = tasks.filter((task) => {
    // Filter by category
    if (filters.category !== "all" && task.category !== filters.category) {
      return false
    }

    // Filter by status
    if (filters.status === "completed" && !task.completed) {
      return false
    }
    if (filters.status === "active" && task.completed) {
      return false
    }

    // Filter by search term
    if (
      filters.search &&
      !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !task.description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }

    // Filter by date
    if (filters.date) {
      const taskDate = new Date(task.dueDate)
      const filterDate = new Date(filters.date)

      if (
        taskDate.getDate() !== filterDate.getDate() ||
        taskDate.getMonth() !== filterDate.getMonth() ||
        taskDate.getFullYear() !== filterDate.getFullYear()
      ) {
        return false
      }
    }

    return true
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Manage and organize your tasks efficiently.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold">My Tasks</h2>
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
            {tasks.length} Tasks
          </span>
        </div>
        <Button onClick={() => setShowTaskForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label htmlFor="category-filter">Category</Label>
            <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status-filter">Status</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date-filter">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.date ? format(filters.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.date}
                  onSelect={(date) => setFilters({ ...filters, date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search tasks..."
                className="pl-8"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TaskList
            tasks={filteredTasks}
            isLoading={isLoading}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        </TabsContent>

        <TabsContent value="active">
          <TaskList
            tasks={filteredTasks.filter((task) => !task.completed)}
            isLoading={isLoading}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        </TabsContent>

        <TabsContent value="completed">
          <TaskList
            tasks={filteredTasks.filter((task) => task.completed)}
            isLoading={isLoading}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        </TabsContent>
      </Tabs>

      {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} onTaskAdded={handleTaskAdded} />}
    </DashboardLayout>
  )
}
