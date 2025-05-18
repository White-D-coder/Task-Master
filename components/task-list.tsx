"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { MoreVertical, Edit, Trash2 } from "lucide-react"
import type { Task } from "@/lib/types"
import { updateTask, deleteTask } from "@/lib/mock-api"
import TaskForm from "@/components/task-form"

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  onTaskUpdated: (task: Task) => void
  onTaskDeleted: (taskId: string) => void
}

export default function TaskList({ tasks, isLoading, onTaskUpdated, onTaskDeleted }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  const handleStatusChange = async (task: Task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed }
      await updateTask(task._id, updatedTask)
      onTaskUpdated(updatedTask)
    } catch (error) {
      console.error("Failed to update task status:", error)
    }
  }

  const handleEditClick = (task: Task) => {
    setEditingTask(task)
  }

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete)
        onTaskDeleted(taskToDelete)
      } catch (error) {
        console.error("Failed to delete task:", error)
      }
    }
    setDeleteDialogOpen(false)
    setTaskToDelete(null)
  }

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-500">No tasks found</h3>
        <p className="text-gray-400 mt-1">Add a new task to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <Card
          key={task._id}
          className={`hover:shadow-md transition-shadow ${task.completed ? "opacity-75 bg-gray-50" : ""}`}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-2">
                <Checkbox checked={task.completed} onCheckedChange={() => handleStatusChange(task)} className="mt-1" />
                <CardTitle className={`text-lg ${task.completed ? "line-through text-gray-500" : ""}`}>
                  {task.title}
                </CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditClick(task)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteClick(task._id)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          </CardContent>
          <CardFooter>
            <Badge className={getCategoryColor(task.category)}>{task.category}</Badge>
          </CardFooter>
        </Card>
      ))}

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskForm task={editingTask} onClose={() => setEditingTask(null)} onTaskUpdated={onTaskUpdated} />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
