import type { Task } from "./types"

// Mock database
const users = [
  {
    _id: "1",
    name: "Demo User",
    email: "demo@example.com",
    password: "password123", // In a real app, this would be hashed
  },
]

let tasks = [
  {
    _id: "1",
    title: "Complete project documentation",
    description: "Write comprehensive documentation for the MERN stack project",
    category: "Work",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    completed: false,
    userId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Buy groceries",
    description: "Milk, eggs, bread, and vegetables",
    category: "Personal",
    dueDate: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    completed: true,
    userId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Fix login bug",
    description: "Address the authentication issue in the login form",
    category: "Urgent",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    completed: false,
    userId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Authentication APIs
export async function registerUser(userData: { name: string; email: string; password: string }) {
  await delay(800) // Simulate network delay

  // Check if user already exists
  const existingUser = users.find((user) => user.email === userData.email)
  if (existingUser) {
    throw new Error("User already exists with this email")
  }

  // Create new user
  const newUser = {
    _id: String(users.length + 1),
    ...userData,
  }

  users.push(newUser)

  // Generate token (in a real app, this would be a JWT)
  const token = `mock-jwt-token-${newUser._id}`

  return {
    token,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  }
}

export async function loginUser(credentials: { email: string; password: string }) {
  await delay(800) // Simulate network delay

  // Find user
  const user = users.find((user) => user.email === credentials.email && user.password === credentials.password)
  if (!user) {
    throw new Error("Invalid email or password")
  }

  // Generate token (in a real app, this would be a JWT)
  const token = `mock-jwt-token-${user._id}`

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  }
}

// Task APIs
export async function fetchTasks() {
  await delay(800) // Simulate network delay

  // In a real app, we would filter by the authenticated user's ID
  return tasks
}

export async function createTask(taskData: Omit<Task, "_id" | "userId" | "createdAt" | "updatedAt">) {
  await delay(800) // Simulate network delay

  const newTask = {
    _id: String(tasks.length + 1),
    ...taskData,
    userId: "1", // In a real app, this would be the authenticated user's ID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  tasks.push(newTask as Task)

  return newTask
}

export async function updateTask(taskId: string, taskData: Partial<Task>) {
  await delay(800) // Simulate network delay

  const taskIndex = tasks.findIndex((task) => task._id === taskId)
  if (taskIndex === -1) {
    throw new Error("Task not found")
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...taskData,
    updatedAt: new Date().toISOString(),
  }

  tasks[taskIndex] = updatedTask

  return updatedTask
}

export async function deleteTask(taskId: string) {
  await delay(800) // Simulate network delay

  const taskIndex = tasks.findIndex((task) => task._id === taskId)
  if (taskIndex === -1) {
    throw new Error("Task not found")
  }

  tasks = tasks.filter((task) => task._id !== taskId)

  return { message: "Task deleted successfully" }
}
