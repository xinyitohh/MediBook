# MediBook 🏥
Online healthcare appointment & patient management platform built with **React 19 + Vite + Tailwind CSS**, **ASP.NET Core 8**, and **AWS**.

## ✨ Highlights
- Role-based access (patient/doctor/admin) with email verification and password reset
- Doctor discovery with specialties, reviews, and availability scheduling
- Appointment booking, confirmations, cancellations, and leave management
- Medical report uploads (S3) and doctor-generated PDF reports
- Pre-visit health questionnaires
- In-app notifications, admin announcements, and push messages
- Serverless email service (AWS Lambda + Resend) for transactional email

## 📁 Project Structure
```
MediBook/
├── backend/                   # ASP.NET Core Web API
├── frontend/                  # React + Vite + Tailwind
├── infra/terraform/           # AWS infrastructure (Terraform)
├── serverless-email-service/  # Lambda email handler (Resend)
└── README.md
```

## ⚙️ Prerequisites
- .NET SDK 8
- Node.js 18+ (npm 9+)
- PostgreSQL
- AWS credentials (required for S3 uploads/SQS/SNS integrations)
- Terraform (optional, for infra provisioning)

## 🔧 Configuration
Create `backend/appsettings.Development.json`:
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
    "Region": "us-east-1",
    "BucketName": "medibook-uploads",
    "SnsTopicArn": "",
    "SqsQueueUrl": "",
    "EmailApiUrl": "https://<api-gateway>/send-email",
    "AccessKey": "",
    "SecretKey": ""
  },
  "Frontend": {
    "BaseUrl": "http://localhost:5173"
  }
}
```
> Update `Region` to match where your AWS resources live (the current backend config defaults to `us-east-1`).  
> Do **not** commit credentials. Prefer IAM roles or AWS credential profiles; `AccessKey`/`SecretKey` are only for local development when needed.

## 🚀 Local Development
### Backend
```bash
cd backend

dotnet restore
# Run migrations
# dotnet ef database update  (or Update-Database in Visual Studio)

dotnet run
```
Swagger: `http://localhost:5082/swagger`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App: `http://localhost:5173`

Vite proxies API calls to `http://localhost:5082` (see `frontend/vite.config.js`).
If you change the backend port, update the proxy target or set `VITE_API_URL` in `frontend/.env`.

### Serverless Email Service (optional)
```bash
cd serverless-email-service
npm install
npm test
```
Deploy to AWS Lambda with `RESEND_API_KEY` (and optional `SENDER_EMAIL`) environment variables.

## 🧪 Seeded Test Accounts
Seeded via EF Core migrations:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@2.com | 2 |
| Patient | patient@2.com | 2 |
| Doctor | doctor@2.com | 2 |

## 📡 API Overview
- Auth & account flows: `/api/auth`
- Doctors & schedules: `/api/doctor`, `/api/specialty`
- Appointments: `/api/appointment`
- Medical reports & uploads: `/api/medical-report`, `/api/upload`
- Reviews & questionnaires: `/api/review`, `/api/healthquestionnaire`
- Notifications & announcements: `/api/notification`, `/api/announcement`
- Admin dashboard: `/api/admindashboard`

See Swagger for the full list of endpoints.

## ✅ Testing & Linting
```bash
# Backend
cd backend

dotnet test

# Frontend
cd ../frontend
npm run lint
npm run build

# Serverless email service
cd ../serverless-email-service
npm test
```

## 🛠️ Tech Stack
**Frontend**
- React 19, Vite 7, Tailwind CSS 4
- React Router, Axios
- ECharts, React Big Calendar, React Datepicker

**Backend**
- ASP.NET Core 8, Entity Framework Core 8
- PostgreSQL
- ASP.NET Identity + JWT
- AutoMapper

**Cloud & Infra**
- AWS S3, SQS, SNS, Lambda, API Gateway, RDS, CloudFront, Elastic Beanstalk
- Terraform
- Resend (serverless email)

## ❓ Common Issues
- **API calls failing in the frontend** → ensure backend is running on `http://localhost:5082` and Vite proxy target matches.
- **`password authentication failed for user "postgres"`** → verify your connection string in `appsettings.Development.json`.
- **File uploads failing** → confirm AWS credentials and `AWS:BucketName` are configured.
- **`npm install` fails** → confirm Node.js 18+ is installed.

## 🌿 Git Workflow
```bash
git checkout -b feature/your-feature
# make changes

git add .
git commit -m "feat: add new feature"
```
Open a PR to merge into `main`.
