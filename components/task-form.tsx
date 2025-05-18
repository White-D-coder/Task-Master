"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import type { Task } from "@/lib/types"
import { createTask, updateTask } from "@/lib/mock-api"

interface TaskFormProps {
  task?: Task
  onClose: () => void
  onTaskAdded?: (task: Task) => void
  onTaskUpdated?: (task: Task) => void
}

export default function TaskForm({ task, onClose, onTaskAdded, onTaskUpdated }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Personal",
    dueDate: new Date(),
    completed: false,
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        category: task.category,
        dueDate: new Date(task.dueDate),
        completed: task.completed,
      })
    }
  }, [task])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, dueDate: date }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title) {
      setError("Title is required")
      return
    }

    try {
      setIsSubmitting(true)

      if (task) {
        // Update existing task
        const updatedTask = await updateTask(task._id, {
          ...formData,
          dueDate: formData.dueDate.toISOString(),
        })
        onTaskUpdated?.(updatedTask)
      } else {
        // Create new task
        const newTask = await createTask({
          ...formData,
          dueDate: formData.dueDate.toISOString(),
        })
        onTaskAdded?.(newTask)
      }

      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to save task")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{task ? "Edit Task" : "Add New Task"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Task title" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Task description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal" id="dueDate">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.dueDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.dueDate} onSelect={handleDateChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : task ? "Update Task" : "Add Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
