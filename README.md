# 🗂️ Task Manager

A modern, full-stack Task Manager web application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **API Routes**. It includes authentication, registration, and task management functionalities.

---

## 🚀 Features

- ✅ User Authentication (Register, Login, Logout)
- 🧾 Task Creation, Retrieval, and Management
- 🌐 Built with App Router (Next.js 14)
- 🎨 Styled using Tailwind CSS
- 🔐 Secure API routes for user and task operations
- ⚡ Performance optimized with modern Next.js practices

---

## 📁 Project Structure

task-manager/
├── app/
│ ├── login/
│ ├── register/
│ ├── dashboard/
│ ├── api/
│ │ ├── auth/
│ │ └── tasks/
│ └── page.tsx
├── components.json
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── ...

yaml
Copy
Edit

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Auth:** Custom API Routes
- **State & Routing:** React + Next.js

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/task-manager.git
   cd task-manager
Install dependencies

bash
Copy
Edit
pnpm install
Run the development server

bash
Copy
Edit
pnpm dev
Open http://localhost:3000 in your browser.

🧪 Available Scripts
pnpm dev - Run development server

pnpm build - Build for production

pnpm start - Start production server

pnpm lint - Lint code

📄 API Endpoints
Auth
POST /api/auth/register - Register a new user

POST /api/auth/login - Login user

POST /api/auth/logout - Logout user

Tasks
GET /api/tasks - Get all tasks

POST /api/tasks - Create a new task

✅ To-Do (Optional Improvements)
Add JWT token-based authentication

Task editing and deletion

Persistent user sessions

User profile settings

📃 License
This project is licensed under the MIT License.

👤 Author
Deeptanu bhunia
GitHub: https://github.com/White-D-coder/Task-Master
