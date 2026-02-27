# MediBook 🏥
Online Healthcare Appointment & Patient Management System

Built with **React** (Frontend) + **ASP.NET Core Web API** (Backend) + **AWS** (Cloud)

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
