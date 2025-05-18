"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import DashboardLayout from "@/components/dashboard-layout"
import type { Task } from "@/lib/types"
import { fetchTasks } from "@/lib/mock-api"

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([])

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    if (selectedDate && tasks.length > 0) {
      const filteredTasks = tasks.filter((task) => {
        const taskDate = new Date(task.dueDate)
        return (
          taskDate.getDate() === selectedDate.getDate() &&
          taskDate.getMonth() === selectedDate.getMonth() &&
          taskDate.getFullYear() === selectedDate.getFullYear()
        )
      })
      setTasksForSelectedDate(filteredTasks)
    } else {
      setTasksForSelectedDate([])
    }
  }, [selectedDate, tasks])

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      const fetchedTasks = await fetchTasks()
      setTasks(fetchedTasks)
    } catch (error) {
      console.error("Failed to load tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to get dates with tasks for highlighting in the calendar
  const getDatesWithTasks = () => {
    const dates: Record<string, { tasks: number; completed: number }> = {}

    tasks.forEach((task) => {
      const dateStr = format(new Date(task.dueDate), "yyyy-MM-dd")
      if (!dates[dateStr]) {
        dates[dateStr] = { tasks: 0, completed: 0 }
      }
      dates[dateStr].tasks++
      if (task.completed) {
        dates[dateStr].completed++
      }
    })

    return dates
  }

  const datesWithTasks = getDatesWithTasks()

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Work":
        return "bg-blue-100 text-blue-800"
      case "Personal":
        return "bg-green-100 text-green-800"
      case "Urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Calendar View</h1>
        <p className="text-gray-500">Visualize your tasks by date and manage your schedule.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Task Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasTasks: (date) => {
                    const dateStr = format(date, "yyyy-MM-dd")
                    return !!datesWithTasks[dateStr]
                  },
                }}
                modifiersStyles={{
                  hasTasks: {
                    fontWeight: "bold",
                    textDecoration: "underline",
                  },
                }}
                components={{
                  DayContent: ({ date }) => {
                    const dateStr = format(date, "yyyy-MM-dd")
                    const dateData = datesWithTasks[dateStr]

                    return (
                      <div className="relative">
                        <div>{date.getDate()}</div>
                        {dateData && (
                          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                            <div
                              className={`h-1 w-1 rounded-full ${
                                dateData.completed === dateData.tasks
                                  ? "bg-green-500"
                                  : dateData.completed > 0
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            ></div>
                          </div>
                        )}
                      </div>
                    )
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : tasksForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {tasksForSelectedDate.map((task) => (
                    <div key={task._id} className="border rounded-md p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                        </div>
                        <Badge className={getCategoryColor(task.category)}>{task.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No tasks for this date</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
