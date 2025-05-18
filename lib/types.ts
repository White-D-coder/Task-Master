export interface Task {
  _id: string
  title: string
  description: string
  category: string
  dueDate: string
  completed: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface User {
  _id: string
  name: string
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}
