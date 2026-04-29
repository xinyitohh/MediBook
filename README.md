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
Create `backend/appsettings.Development.json`. Use the same AWS region as your existing resources (for example `us-east-1` or `ap-southeast-1`; the repo's `backend/appsettings.json` defaults to `us-east-1`):
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
    "Region": "<your-region>",
    "BucketName": "medibook-uploads",
    "SnsTopicArn": "",
    "SqsQueueUrl": "",
    "EmailApiUrl": "https://<api-gateway-id>.execute-api.<region>.amazonaws.com/send-email",
    "AccessKey": "",
    "SecretKey": ""
  },
  "Frontend": {
    "BaseUrl": "http://localhost:5173"
  }
}
```
> Replace `<your-region>` with your actual AWS region (for example `us-east-1` or `ap-southeast-1`).  
> `EmailApiUrl` should be the API Gateway **Invoke URL** (from the AWS Console or Terraform outputs); replace both `<api-gateway-id>` and `<region>` to match your deployment.
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
Port is defined in `backend/Properties/launchSettings.json` (not in `appsettings.Development.json`).

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

## ☁️ AWS Deployment (Current)
Production is already deployed on AWS:
- Frontend: https://medibook.xinyitoh.com (CloudFront + S3)
- API: https://api.medibook.xinyitoh.com (CloudFront → Elastic Beanstalk)

Architecture diagram source:
```text
Users [icon: users] {
  Patient [icon: user]
  Doctor [icon: user]
  Admin [icon: shield]
}

CI/CD Pipeline [icon: git-branch, color: gray] {
  GitHub Actions [icon: github, label: "GitHub Actions (CI/CD)"]
  ECR [icon: aws-ecr, label: "ECR (Docker Images)"]
}

Frontend [icon: react, color: blue] {
  Route53 [icon: aws-route-53, label: "Route 53 (DNS)"]
  CloudFront CDN [icon: aws-cloudfront, label: "CloudFront (medibook.xinyitoh.com)"]
  CloudFront API [icon: aws-cloudfront, label: "CloudFront (api.medibook.xinyitoh.com)"]
  S3 Frontend [icon: aws-s3, label: "S3 (React App)"]
  ACM [icon: aws-certificate-manager, label: "ACM (SSL Certificate)"]
}

Backend [icon: aws-elastic-beanstalk, color: green] {
  Elastic Beanstalk [icon: aws-elastic-beanstalk, label: "Elastic Beanstalk (ASP.NET Docker)"]
}

Data Storage [icon: database] {
  RDS PostgreSQL [icon: aws-rds]
  S3 Uploads [icon: aws-s3, label: "S3 (Uploads)"]
}

AI Chat Service [icon: message-circle, color: purple] {
  Chat API Gateway [icon: aws-api-gateway, label: "API Gateway"]
  Amazon Lex [icon: aws-lex, label: "Lex (Patient Chatbot)"]
  Booking Lambda [icon: aws-lambda, label: "Lambda (Book Appt)"]
  Chat Lambda [icon: aws-lambda, label: "Lambda (Fallback Chat)"]
  Bedrock Claude [icon: aws-bedrock, label: "Bedrock (Claude)"]
}

Reminder Service [icon: clock, color: orange] {
  EventBridge [icon: aws-eventbridge, label: "EventBridge (Cron)"]
  Reminder Lambda [icon: aws-lambda, label: "Lambda (Reminders)"]
  SQS Queue [icon: aws-sqs, label: "SQS"]
  Send Lambda [icon: aws-lambda, label: "Lambda (Send)"]
}

Notifications [icon: mail] {
  Resend [icon: external-link, label: "Resend.com (Email API)"]
}

Terraform State [icon: aws-s3, color: brown] {
  TF State Bucket [icon: aws-s3, label: "S3 (Terraform State)"]
  TF Lock Table [icon: aws-dynamodb, label: "DynamoDB (State Lock)"]
}

Monitoring [icon: activity] {
  CloudWatch [icon: aws-cloudwatch]
}

// CI/CD flow
GitHub Actions > ECR: push Docker image
GitHub Actions > S3 Frontend: deploy React build
GitHub Actions > Elastic Beanstalk: deploy new version
GitHub Actions > CloudFront CDN: invalidate cache
GitHub Actions > CloudFront API: invalidate cache

// ECR to EB
ECR > Elastic Beanstalk: pull Docker image

// DNS and SSL
Route53 > CloudFront CDN
Route53 > CloudFront API
ACM > CloudFront CDN: SSL cert
ACM > CloudFront API: SSL cert

// User flow
Users > Route53
CloudFront CDN > S3 Frontend
CloudFront API > Elastic Beanstalk

// Backend connections
Elastic Beanstalk <> RDS PostgreSQL
Elastic Beanstalk > S3 Uploads
Elastic Beanstalk > Resend: email OTP & notifications
Elastic Beanstalk > Chat API Gateway

// AI Chat flow
Chat API Gateway > Amazon Lex
Amazon Lex > Bedrock Claude: Health Q&A Intent
Amazon Lex > Booking Lambda: Book Appt Intent
Amazon Lex > Chat Lambda: Fallback / Complex Chat
Booking Lambda > Elastic Beanstalk: POST /api/booking
Chat Lambda <> Bedrock Claude: generate response

// Reminder flow
EventBridge --> Reminder Lambda: daily 8am trigger
Reminder Lambda > SQS Queue
SQS Queue --> Send Lambda
Send Lambda > Resend: send reminders

// Terraform state flow
GitHub Actions <> TF State Bucket: read/write state
GitHub Actions <> TF Lock Table: acquire/release lock

// Logging and monitoring
Elastic Beanstalk --> CloudWatch: audit logs & metrics
```

## ❓ Common Issues
- **API calls failing in the frontend** → ensure the backend is running on the port configured in `backend/Properties/launchSettings.json` (default `http://localhost:5082`) and the Vite proxy target matches.
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
