import type { Task } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function to handle API responses
async function handleResponse(response: Response) {
  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || "An error occurred") as Error & { status?: number }
    error.status = response.status
    throw error
  }

  return data
}

// Get the auth token from localStorage
function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Authentication APIs
export async function registerUser(userData: { name: string; email: string; password: string }) {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  return handleResponse(response)
}

export async function loginUser(credentials: { email: string; password: string }) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  return handleResponse(response)
}

// Task APIs
export async function fetchTasks() {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse(response)
}

export async function createTask(taskData: Omit<Task, "_id" | "userId" | "createdAt" | "updatedAt">) {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  })

  return handleResponse(response)
}

export async function updateTask(taskId: string, taskData: Partial<Task>) {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  })

  return handleResponse(response)
}

export async function deleteTask(taskId: string) {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse(response)
}
