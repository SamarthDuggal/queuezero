```
# QueueZero

QueueZero is a virtual queue management platform that helps businesses and service providers manage waiting lines digitally. Hosts can create and manage a live queue, while guests can join remotely and receive a digital queue position instead of physically standing in line.

## 🚀 Live Application

**Live App:** https://queuezero-pink.vercel.app

**GitHub Repository:** https://github.com/SamarthDuggal/queuezero

---

# 📌 Problem Statement

Physical queues create unnecessary waiting, overcrowding, and uncertainty. Customers often have to stand in line without knowing:

- How many people are ahead of them
- How long they will need to wait
- When their turn will arrive

QueueZero provides a digital alternative to physical waiting lines.

A host can create a virtual queue and share a unique queue code or link with guests. Guests can join the queue remotely and receive a digital ticket, while the host manages the queue through a dedicated dashboard.

---

# 💡 Core Business Flow

The main user journey in QueueZero is:

```text
Host signs up / logs in
        ↓
Host creates a queue
        ↓
A unique queue code is generated
        ↓
Host shares the queue link/code
        ↓
Guest joins the queue
        ↓
Guest receives a digital ticket
        ↓
Host manages the queue
        ↓
Host calls the next guest
        ↓
Guest is served
```

This enables users to wait remotely instead of standing in a physical line.

---

# ✨ Features

## 🔐 Authentication

QueueZero uses Supabase Authentication to support:

-  User sign up 
-  User login 
-  User logout 
-  Session management 

---

## 📋 Queue Management

Hosts can:

-  Create a live queue 
-  Enter a venue name 
-  Enter a queue name 
-  Set the average service time per guest 
-  Receive a unique queue code 
-  View the host dashboard 
-  Pause and resume new joins 
-  Call the next guest 
-  Mark a guest as complete 
-  Mark a guest as a no-show 

---

## 🎟️ Guest Queue Flow

Guests can:

-  Access a queue using a queue code or shared link 
-  Join a queue remotely 
-  Receive a digital ticket 
-  View their queue position and status 
-  Track their progress through the queue 

---

## 🖥️ Queue Board

The application also provides a queue board that displays the current queue status and supports a clear view of the active queue.

---

# 🔄 CRUD Implementation

QueueZero implements CRUD functionality using its core queue and ticket entities.


| CRUD Operation | QueueZero Implementation                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Create**     | A host creates a queue and guests create tickets by joining the queue                                                      |
| **Read**       | Hosts and guests can retrieve and view queue and ticket information                                                        |
| **Update**     | Queue status and ticket status can be updated through actions such as pause, resume, call next, complete, skip, and recall |
| **Delete**     | Ticket/queue records can be removed as part of the application's data management functionality                             |


The application includes API routes for queue and ticket operations.

Examples include:

```

```

```
/api/queues
/api/queues/[code]
/api/queues/[code]/call
/api/queues/[code]/tickets
/api/queues/[code]/tickets/[ticketId]
```

---

# 🏗️ Architecture

```

```

```
                     ┌─────────────────┐
                     │      USER       │
                     └────────┬────────┘
                              │
                              ▼
                  ┌──────────────────────┐
                  │      NEXT.JS APP     │
                  │                      │
                  │  UI + Business Logic │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   NEXT.JS API ROUTES │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │       SUPABASE       │
                  │                      │
                  │  Authentication      │
                  │  Database            │
                  └──────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │        VERCEL        │
                  │  Production Hosting  │
                  └──────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

-  Next.js 
-  React 
-  TypeScript 
-  Tailwind CSS 

## Backend

-  Next.js API Routes 
-  Supabase 

## Authentication

-  Supabase Authentication 

## Database

-  Supabase PostgreSQL Database 

## Deployment

-  Vercel 

## Development Tools

-  Git 
-  GitHub 
-  npm 
-  Visual Studio Code 
-  PowerShell 

## AI Assistance

AI tools were used during development to assist with:

-  Application planning 
-  Architecture decisions 
-  Code generation 
-  Debugging 
-  Error resolution 
-  Supabase integration 
-  Deployment troubleshooting 

---

# 📂 Project Structure

The project follows the Next.js App Router architecture.

```

```

```
queuezero/
│
├── app/
│   ├── api/
│   │   └── queues/
│   │
│   ├── auth/
│   ├── board/
│   ├── host/
│   ├── join/
│   ├── ticket/
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── CreateQueueForm.tsx
│   ├── HostDesk.tsx
│   ├── SiteFooter.tsx
│   ├── SiteHeader.tsx
│   └── other UI components
│
├── lib/
│   ├── api.ts
│   ├── supabase.ts
│   ├── types.ts
│   └── other utilities
│
├── public/
│
├── package.json
├── next.config.ts
└── README.md
```

---

# ⚙️ Local Setup

## 1. Clone the repository

```

```

```
git clone https://github.com/SamarthDuggal/queuezero.git
```

Move into the project folder:

```

```

```
cd queuezero
```

---

## 2. Install dependencies

```

```

```
npm install
```

---

## 3. Configure environment variables

Create a `.env.local` file in the root directory.

Add:

```

```

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Do not commit environment variables containing credentials or sensitive information to GitHub.

---

## 4. Run the development server

```

```

```
npm run dev
```

Open the application at:

```

```

```
http://localhost:3000
```

---

# 🧪 Testing

The application was tested end-to-end after deployment.

The following flows were tested:

-  User signup 
-  User login 
-  User logout 
-  Queue creation 
-  Queue retrieval 
-  Guest joining 
-  Ticket generation 
-  Host dashboard functionality 
-  Calling the next guest 
-  Updating ticket status 
-  Production deployment functionality 

---

# 🌐 Deployment

QueueZero is deployed using Vercel.

**Production URL:**

[https://queuezero-pink.vercel.app](https://queuezero-pink.vercel.app)

The production application is configured with the required Supabase environment variables through Vercel.

---

# 🎯 Assignment Requirements

This project was built to satisfy three mandatory application requirements.

## 1. Authentication

The application supports:

-  Sign up 
-  Login 
-  Logout 

Authentication is implemented using Supabase Authentication.

---

## 2. CRUD

The application's queue and ticket entities support core data operations:

-  Create 
-  Read 
-  Update 
-  Delete 

---

## 3. Complete Business Flow

The complete QueueZero business flow is:

```

```

```
Host creates a queue
        ↓
Unique queue code is generated
        ↓
Guest receives queue link/code
        ↓
Guest joins the queue
        ↓
Digital ticket is generated
        ↓
Host views the waiting queue
        ↓
Host calls the next guest
        ↓
Ticket status is updated
        ↓
Guest is served
```

---

# 👤 Author

**Samarth Duggal**

GitHub: [https://github.com/SamarthDuggal](https://github.com/SamarthDuggal)

---

# 📄 License

This project was created as part of an academic application development assignment.