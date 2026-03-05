# MediBook 🏥
Online Healthcare Appointment & Patient Management System

Built with **React** (Frontend) + **ASP.NET Core Web API** (Backend) + **AWS** (Cloud)


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
<a id="-team-members"></a>
## 👥 Team Members Tasks Distribution

### Member 1 — Auth + Patient Profile + My Appointments
**Difficulty: ★★★☆☆ (Medium)**

You build the foundation everyone depends on, then the patient's "view & manage" side.

| Feature | Frontend | Backend | Complexity |
|---------|----------|---------|------------|
| Register page | Form with validation | `POST /api/auth/register` (Identity handles hashing) | Low |
| Login page | Form, store JWT, redirect by role | `POST /api/auth/login` (generate JWT) | Low-Med |
| Role-based routing | PrivateRoute component, redirect unauthorized | Auth middleware + `[Authorize(Roles)]` | Medium |
| Navbar + Layout | Dynamic navbar based on role (Patient/Doctor/Admin) | — | Low |
| Patient profile setup | Form: name, DOB, gender, phone, address | `POST /api/patient/profile` | Low |
| Edit patient profile | Pre-filled form, update | `PUT /api/patient/profile` | Low |
| **My Appointments page** | List with status badges, filter by status, cancel button with confirmation | `GET /api/appointment/my`, `PUT /api/appointment/{id}/cancel` | **Medium** |
| Seed data script | Create test accounts for all 4 roles + sample doctors | DbContext seed in migration | Low |

**Total: ~8 pages, ~8 API endpoints**

Why this is fair: Auth is critical-path (must finish first) which adds pressure. My Appointments has filtering logic and cancel flow with validation (can't cancel completed/already cancelled). You finish the core auth early, then build My Appointments while others build their features. If teammates need help, you're free to assist.

---

### Member 2 — Doctor Listing + Booking Flow
**Difficulty: ★★★☆☆ (Medium)**

Previously this was the hardest role. Now it's lighter because My Appointments was moved to Member 1.

| Feature | Frontend | Backend | Complexity |
|---------|----------|---------|------------|
| Browse doctors page | Doctor cards grid with photo, specialty, availability badge | `GET /api/doctor` with query params | Medium |
| Search & filter | Search by name + filter by specialty dropdown | Query filtering in LINQ | Low-Med |
| Doctor detail page | Full profile, description, reviews placeholder | `GET /api/doctor/{id}` | Low |
| Available time slots | Date picker → fetch & display open slots for that date | `GET /api/doctor/{id}/slots?date=` — **must calculate which slots are already booked** | **Hard** |
| Book appointment | Select slot, add notes, confirm → save | `POST /api/appointment` with double-booking validation | **Medium-Hard** |
| Booking confirmation | Success message with appointment details | — (frontend only) | Low |

**Total: ~6 pages, ~5 API endpoints**

Why this is fair: The time slot calculation + booking validation is still the single hardest piece of logic in the app, but now this member only has 6 pages instead of 8+. No My Appointments to worry about.

---

### Member 3 — Doctor Dashboard + Appointment Management + Medical Reports
**Difficulty: ★★★☆☆ (Medium)**

Previously too easy. Now has Medical Reports (upload/view/download) added, which involves file handling logic.

| Feature | Frontend | Backend | Complexity |
|---------|----------|---------|------------|
| Doctor dashboard | Today's count, upcoming appointments list | `GET /api/doctor/my-schedule` with date filters | Low-Med |
| Doctor schedule view | Full list of appointments, filter by date/status | Query params + LINQ filtering | Medium |
| Confirm appointment | Button → status change → (placeholder for SQS later) | `PUT /api/appointment/{id}/confirm` | Low |
| Complete appointment | Button + doctor notes textarea | `PUT /api/appointment/{id}/complete` | Low |
| Cancel appointment (doctor) | Button + reason field, validation | `PUT /api/appointment/{id}/doctor-cancel` | Low-Med |
| **Medical report upload** | File input, drag & drop area, file type validation (PDF/JPG/PNG), size limit (10MB), progress bar | `POST /api/upload/medical-report` — handle multipart form, save to local folder (swap to S3 in Task 2) | **Medium-Hard** |
| **My medical reports list** | Table of uploaded files with download links, delete button | `GET /api/medical-report/my`, `POST /api/medical-report`, `DELETE /api/medical-report/{id}` | **Medium** |
| **View patient reports (doctor)** | View patient's reports within appointment context | `GET /api/medical-report/patient/{id}` | Low-Med |

**Total: ~8 pages, ~10 API endpoints**

Why this is fair: The doctor appointment management is simple logic (status updates), but the medical report upload/download system adds real complexity — file type validation, size limits, building a reusable upload component, download via pre-signed URLs later. This person also has the most API endpoints.

---

### Member 4 — Admin Panel + Doctor Profile & Availability
**Difficulty: ★★★☆☆ (Medium)**

Previously had too many CRUD tables. Now Doctor Profile + Availability is moved here (from the old Member 3), which adds more interesting logic. Some simpler admin features are kept to balance volume.

| Feature | Frontend | Backend | Complexity |
|---------|----------|---------|------------|
| Admin dashboard | Stats cards: total patients, doctors, appointments today, pending count | `GET /api/admin/dashboard` — aggregate queries | Medium |
| Manage doctors (admin) | Table + Add/Edit modal with form + Delete with confirmation | `POST/PUT/DELETE /api/admin/doctors` | Medium (volume) |
| Manage patients (admin) | Table with search + deactivate toggle | `GET /api/admin/patients`, `PUT .../deactivate` | Low-Med |
| Manage all appointments | Full list, filter by doctor/patient/date/status | `GET /api/admin/appointments` with multi-filter | Medium |
| **Doctor profile edit** | Edit form: name, specialty, description, phone, profile image upload | `GET /api/doctor/profile`, `PUT /api/doctor/profile` | Low-Med |
| **Doctor availability management** | Day-of-week toggles, start/end time pickers, slot duration setting | `GET/PUT /api/doctor/availability` — DoctorSchedule CRUD | **Medium-Hard** |
| Manage specialties | Simple CRUD list (for dropdown options across app) | `CRUD /api/admin/specialties` | Low |

**Total: ~8 pages, ~12 API endpoints**

Why this is fair: The admin CRUD is repetitive but high volume (lots of endpoints). The availability management adds real complexity — building the schedule UI with day toggles and time pickers, storing/retrieving DoctorSchedule records, and this ties directly into Member 2's time slot calculation (they need this data). Most API endpoints of anyone.

---

## Difficulty Comparison

| Member | Hard Features | Medium Features | Easy Features | Total Pages | Total APIs | Overall |
|--------|--------------|-----------------|---------------|-------------|------------|---------|
| 1 | — | Auth + routing, My Appointments (cancel logic, filters) | Profile CRUD, seed data | ~8 | ~8 | ★★★☆☆ |
| 2 | Time slot calc, booking validation | Doctor listing + search | Doctor detail, confirmation | ~6 | ~5 | ★★★☆☆ |
| 3 | File upload component (drag & drop, validation, progress) | Report list + download, doctor schedule view | Status updates (confirm/complete/cancel) | ~8 | ~10 | ★★★☆☆ |
| 4 | Availability management (schedule UI) | Admin dashboard (aggregate queries), manage doctors | Manage patients, specialties | ~8 | ~12 | ★★★☆☆ |

**The tradeoffs:**
- Member 2 has fewer pages but the single hardest logic (slot calculation)
- Member 3 has more API endpoints and the file upload complexity
- Member 4 has the most API endpoints but they're mostly repetitive CRUD
- Member 1 has the time pressure of going first, plus you'll be helping others as team lead

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
