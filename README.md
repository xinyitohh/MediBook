# MediBook 🏥
Online Healthcare Appointment & Patient Management System

Built with **React** (Frontend) + **ASP.NET Core Web API** (Backend) + **AWS** (Cloud)

[Go to the Frontend Section](#medibook-frontend-🏥)

## 📑 Table of Contents
* [Team Members](#-team-members)
* [Project Structure](#-project-structure)
* [Prerequisites](#prerequisites)
* [Getting Started (Backend)](#-getting-started)
* [Test Accounts](#-test-accounts)
* [API Endpoints](#-api-endpoints)
* [Git Workflow](#-git-workflow)
* [Tech Stack](#-tech-stack)
* [Common Issues](#-common-issues)
* [Questions?](#-questions)
* [MediBook Frontend](#medibook-frontend-)
  * [Prerequisites (Frontend)](#-prerequisites-1)
  * [Getting Started (Frontend)](#-getting-started-1)
  * [Project Structure (Frontend)](#-project-structure-1)
  * [Pages & Routes](#-pages--routes)
  * [How Authentication Works](#-how-authentication-works)
  * [How to Call APIs](#-how-to-call-apis)
  * [How to Add a New Page](#-how-to-add-a-new-page)
  * [Styling Guide](#-styling-guide)
  * [Git Workflow (Frontend)](#-git-workflow-1)
  * [Dependencies](#-dependencies)
  * [Common Issues (Frontend)](#-common-issues-1)
  * [Build for Production](#-build-for-production)

---

## 👥 Team Members
| Name | Student ID | Role |
|------|-----------|------|
| Member 1 | TP0XXXXX | Frontend Developer |
| Member 2 | TP0XXXXX | Frontend Developer |
| Member 3 | TP0XXXXX | Backend Developer |
| Member 4 | TP0XXXXX | Backend Developer / AWS |

---

## 📁 Project Structure
```
MediBook/
├── frontend/        ← React app (Vite)
├── backend/         ← ASP.NET Core Web API
└── README.md
```

---
<a id="prerequisites"></a>
## ⚙️ Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|------|---------|----------|
| .NET SDK | 8.0 | https://dotnet.microsoft.com/download |
| Node.js | 18+ | https://nodejs.org |
| Git | Latest | https://git-scm.com |
| Visual Studio | 2022 Community | https://visualstudio.microsoft.com |
| VS Code | Latest | https://code.visualstudio.com |
| pgAdmin | Latest | https://www.pgadmin.org (Windows only) |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/xinyitohh/MediBook.git
cd MediBook
```

---

### 2. Backend Setup

#### 2a. Create your local config file
In the `backend/` folder, create a new file called `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=YOUR_DB_HOST;Database=medibook;Username=postgres;Password=YOUR_PASSWORD;"
  },
  "Jwt": {
    "Key": "MediBookSuperSecretKey12345678901234",
    "Issuer": "MediBook",
    "Audience": "MediBook"
  },
  "AWS": {
    "Region": "ap-southeast-1",
    "BucketName": "medibook-uploads",
    "SnsTopicArn": "",
    "SqsQueueUrl": ""
  }
}
```

> ⚠️ **IMPORTANT:** This file is gitignored and must NEVER be committed to GitHub.
> Get the actual database connection string from your team lead via WhatsApp.

#### 2b. Open backend in Visual Studio
- Open Visual Studio 2022
- File → Open → Project/Solution
- Navigate to `MediBook/backend/` and open `backend.csproj`

#### 2c. Run database migrations
In **Package Manager Console** (Tools → NuGet Package Manager → Package Manager Console):
```powershell
Update-Database
```

This creates all the database tables automatically.

#### 2d. Run the backend
- Change run profile from **Docker** to **IIS Express** or **https** (dropdown next to run button)
- Press **F5**
- Swagger opens at `https://localhost:XXXX/swagger`
- You should see all API endpoints listed ✅

---

### 3. Frontend Setup

#### 3a. Navigate to frontend folder
```bash
cd frontend
```

#### 3b. Install dependencies
```bash
npm install
```

#### 3c. Create environment file
In the `frontend/` folder, create a `.env` file:
```
VITE_API_URL=https://localhost:7001
```
> Change the port number to match your backend port shown in Swagger URL.
> Get the production URL from team lead when deployed to AWS.

#### 3d. Run the frontend
```bash
npm run dev
```
App opens at `http://localhost:5173` ✅

---

## 🔑 Test Accounts

After running the backend, register these accounts via Swagger or the app:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medibook.com | Admin123 |
| Patient | patient@medibook.com | Patient123 |

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | None | Register new user |
| POST | /api/auth/login | None | Login, returns JWT token |
| GET | /api/doctor | None | Get all doctors |
| GET | /api/doctor/{id} | None | Get doctor by ID |
| POST | /api/doctor | Admin | Create doctor |
| PUT | /api/doctor/{id} | Admin | Update doctor |
| DELETE | /api/doctor/{id} | Admin | Delete doctor |
| GET | /api/patient/profile | Login | Get my profile |
| POST | /api/patient/profile | Login | Create my profile |
| PUT | /api/patient/profile | Login | Update my profile |
| GET | /api/patient/all | Admin | Get all patients |
| GET | /api/appointment | Login | Get my appointments |
| POST | /api/appointment | Login | Book appointment |
| PUT | /api/appointment/{id}/cancel | Login | Cancel appointment |
| PUT | /api/appointment/{id}/confirm | Admin/Doctor | Confirm appointment |
| GET | /api/appointment/all | Admin | Get all appointments |

---

## 🌿 Git Workflow

We use feature branches. Never commit directly to `main`.

```bash
# Before starting work, always pull latest
git pull origin main

# Create your own branch
git checkout -b feature/your-feature-name

# Examples:
git checkout -b feature/doctor-list-page
git checkout -b feature/appointment-booking
git checkout -b fix/login-bug

# After making changes, commit
git add .
git commit -m "feat: add doctor list page"
git push origin feature/your-feature-name

# Then create a Pull Request on GitHub to merge into main
```

### Commit Message Format
```
feat: add new feature
fix: bug fix
style: UI changes
refactor: code cleanup
docs: update readme
```

---
<a id="-tech-stack"></a>
## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| Vite | Build tool |
| React Router DOM | Page routing |
| Axios | API calls |
| Bootstrap 5 | Styling |

### Backend
| Technology | Purpose |
|-----------|---------|
| ASP.NET Core 8 | Web API framework |
| Entity Framework Core 8 | Database ORM |
| PostgreSQL | Database |
| ASP.NET Identity | User management |
| JWT Bearer | Authentication |
| Swagger / OpenAPI | API documentation |

### AWS (Task 2)
| Service | Purpose |
|---------|---------|
| Elastic Beanstalk | Host backend API |
| S3 | Host frontend + file uploads |
| RDS PostgreSQL | Cloud database |
| Lambda | Serverless notifications |
| SQS | Message queue |
| SNS | Email notifications |
| API Gateway | Expose Lambda endpoints |
| CloudWatch | Monitoring & logs |
| X-Ray | Performance tracing |

---

## ❓ Common Issues

**`password authentication failed for user "postgres"`**
→ Wrong password in your `appsettings.Development.json`. Check with team lead for correct connection string.

**`Docker Desktop required` error when pressing F5**
→ Change run profile from Docker to IIS Express using the dropdown next to the run button.

**`npm install` fails**
→ Make sure Node.js 18+ is installed. Run `node --version` to check.

**Backend port not matching frontend .env**
→ Check what port Swagger opens on, update `VITE_API_URL` in `frontend/.env` to match.

**Migration errors**
→ Make sure your `appsettings.Development.json` has the correct database connection string, then run `Update-Database` again.

---

## 📞 Questions?
Contact your team lead or message the group chat.


# MediBook Frontend 🏥

React frontend for MediBook — Online Healthcare Appointment System.

Built with **React 18 + Vite + Bootstrap 5**

---
<a id="-prerequisites-1"></a>
## ⚙️ Prerequisites - F

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | comes with Node.js |
| VS Code | Latest | https://code.visualstudio.com |

### Recommended VS Code Extensions
- **ES7+ React/Redux/React-Native snippets** — React shortcuts
- **Prettier** — code formatting
- **Auto Rename Tag** — renames JSX tags automatically
- **ESLint** — catches errors as you type

---

## 🚀 Getting Started

### 1. Navigate to frontend folder
```bash
cd MediBook/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
Create a `.env` file inside the `frontend/` folder:
```
VITE_API_URL=
```
> Leave VITE_API_URL empty — API calls are proxied through Vite to the backend automatically.

### 4. Make sure backend is running first
- Open backend in Visual Studio
- Press F5
- Confirm Swagger is accessible at `https://localhost:44355/swagger`

### 5. Run the frontend
```bash
npm run dev
```
App opens at `http://localhost:5173` ✅

---

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/             ← Reusable UI components
│   │   ├── Navbar.jsx          ← Top navigation bar
│   │   └── ProtectedRoute.jsx  ← Guards pages that require login
│   ├── context/
│   │   └── AuthContext.jsx     ← Global auth state (logged in user)
│   ├── pages/                  ← One file per page/route
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Doctors.jsx
│   │   ├── Appointments.jsx
│   │   ├── Profile.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/               ← All API calls (never call API directly in pages)
│   │   ├── api.js              ← Axios instance with JWT interceptor
│   │   ├── authService.js      ← Login, register
│   │   ├── doctorService.js    ← Doctor CRUD
│   │   └── appointmentService.js ← Appointment booking
│   ├── App.jsx                 ← Routes setup
│   └── main.jsx                ← Entry point
├── .env                        ← gitignored, your local config
├── vite.config.js              ← Vite + proxy config
└── package.json
```

---

## 🌐 Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/doctors` | Doctor Listing | Public |
| `/appointments` | My Appointments | Login required |
| `/profile` | My Profile | Login required |
| `/admin` | Admin Dashboard | Admin only |

---

## 🔑 How Authentication Works

1. User logs in → backend returns a **JWT token**
2. Token is stored in `localStorage`
3. Every API call automatically includes the token via axios interceptor in `api.js`
4. If token expires (401 response) → user is redirected to login automatically
5. `AuthContext` provides user info to any component via `useAuth()` hook

### Using the auth hook in any component:
```jsx
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, logoutUser } = useAuth()

  return (
    <div>
      <p>Welcome {user.fullName}</p>
      <p>Role: {user.role}</p>
      <button onClick={logoutUser}>Logout</button>
    </div>
  )
}
```

---

## 📡 How to Call APIs

Never use `fetch()` directly. Always use the service files:

```javascript
// ✅ Correct way
import { getDoctors } from '../services/doctorService'

useEffect(() => {
  getDoctors()
    .then(res => setDoctors(res.data))
    .catch(err => console.error(err))
}, [])

// ❌ Wrong way - don't do this
fetch('https://localhost:44355/api/doctor')
```

### Adding a new API call:
Add it to the relevant service file:
```javascript
// In doctorService.js
export const searchDoctors = (specialty) =>
  api.get(`/api/doctor/search?specialty=${specialty}`)
```

---

## 🧩 How to Add a New Page

1. Create the page file in `src/pages/`:
```jsx
// src/pages/MyNewPage.jsx
export default function MyNewPage() {
  return (
    <div>
      <h2>My New Page</h2>
    </div>
  )
}
```

2. Add the route in `App.jsx`:
```jsx
import MyNewPage from './pages/MyNewPage'

// Inside <Routes>:
<Route path="/my-new-page" element={<MyNewPage />} />

// If login required:
<Route
  path="/my-new-page"
  element={
    <ProtectedRoute>
      <MyNewPage />
    </ProtectedRoute>
  }
/>
```

3. Add a link in `Navbar.jsx`:
```jsx
<li className="nav-item">
  <Link className="nav-link" to="/my-new-page">My New Page</Link>
</li>
```

---

## 🎨 Styling Guide

We use **Bootstrap 5** for all styling. No custom CSS files unless absolutely necessary.

### Common Bootstrap classes used:
```
Layout:     container, row, col-md-4, d-flex, justify-content-center
Cards:      card, card-body, card-title, card-footer, shadow-sm
Buttons:    btn, btn-primary, btn-outline-danger, btn-sm, w-100
Forms:      form-control, form-label, form-select
Alerts:     alert, alert-danger, alert-success
Badges:     badge, bg-success, bg-warning, bg-danger
Text:       text-muted, text-center, fw-bold, small
Spacing:    mt-4, mb-3, p-4, g-3, gap-2
```

### Example card component:
```jsx
<div className="card shadow-sm">
  <div className="card-body p-4">
    <h5 className="card-title">Title</h5>
    <p className="card-text text-muted">Content</p>
    <button className="btn btn-primary w-100">Action</button>
  </div>
</div>
```

---

## 🌿 Git Workflow

Never commit directly to `main`. Always use feature branches.

```bash
# Before starting, pull latest
git pull origin main

# Create your branch
git checkout -b feature/your-feature-name

# Examples:
git checkout -b feature/profile-page
git checkout -b feature/admin-dashboard
git checkout -b fix/appointment-bug

# After changes:
git add .
git commit -m "feat: complete profile page"
git push origin feature/your-feature-name

# Then open Pull Request on GitHub to merge into main
```

### Commit message format:
```
feat: add new feature
fix: bug fix
style: UI/styling changes
refactor: code cleanup
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.x | UI framework |
| react-dom | 18.x | DOM rendering |
| react-router-dom | 6.x | Page routing |
| axios | 1.x | HTTP API calls |
| bootstrap | 5.x | CSS styling |
| vite | 5.x | Build tool & dev server |

---

## ❓ Common Issues

**Login/Register fails with Network Error**
→ Make sure backend is running at `https://localhost:44355`
→ Check `vite.config.js` has the correct port in the proxy target

**`npm install` fails**
→ Run `node --version` — must be 18+
→ Try deleting `node_modules/` folder and running `npm install` again

**Page shows but API data doesn't load**
→ Open DevTools (F12) → Console tab → look for red error messages
→ Check backend is running
→ Check you are logged in for protected endpoints

**Blank page after changes**
→ Check DevTools Console for JavaScript errors
→ Make sure all imports are correct (file names are case sensitive)

**Changes not showing**
→ Vite hot reloads automatically — if not working, restart with `npm run dev`

---
<a id="-build-for-production"></a>
## 🏗️ Build for Production

When ready to deploy to AWS S3:
```bash
npm run build
```
This creates a `dist/` folder with static files ready to upload to S3.

> Remember to update `VITE_API_URL` in `.env` to your AWS Elastic Beanstalk URL before building:
> ```
> VITE_API_URL=http://your-app.elasticbeanstalk.com
> ```
> And remove the proxy from `vite.config.js` for production build.
