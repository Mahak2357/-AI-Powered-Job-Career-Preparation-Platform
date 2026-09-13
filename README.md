<img width="1917" height="708" alt="image" src="https://github.com/user-attachments/assets/9fa0e30d-6b5f-46b2-bb46-fa445c765682" />


# PrepAI — AI-Powered Job & Career Preparation Platform

PrepAI is a full-stack AI-powered career preparation platform designed to help students and software engineers prepare smarter for their target roles.

It analyzes candidate profiles and resumes, identifies relevant skills and skill gaps, generates personalized preparation roadmaps, and provides targeted technical and behavioral interview preparation using Google Gemini.

## 🚀 Live Demo

**Frontend:** https://ai-powered-job-career-preparation-p.vercel.app/

**Backend:** https://ai-powered-job-career-preparation.onrender.com/

## ✨ Key Features

* 🔐 **Authentication & Authorization** — Secure registration, login, JWT-based sessions, and protected routes.
* 🎯 **Personalized Onboarding** — Collects target roles, companies, career goals, and resume information.
* 📄 **Resume Analysis** — Securely extracts text from PDF and DOCX resumes for AI-powered analysis.
* 🧠 **AI Skill Detection** — Identifies relevant skills, missing skills, suitable roles, readiness score, and recommendations.
* 🗺️ **Personalized Roadmap** — Generates role-focused preparation plans with milestones and important topics.
* 💬 **AI Interview Preparation** — Supports technical and behavioral interview preparation.
* 📊 **Progress Tracking** — Helps users track preparation progress and continue unfinished tasks.
* ⚡ **Resilient AI Processing** — Handles temporary Gemini API failures with graceful fallback behavior.
* 📱 **Responsive SaaS UI** — Modern dark-themed interface designed for desktop and mobile.
* 🔒 **Secure Resume Processing** — Validates file type and size, processes resume text in memory, and limits extracted content before AI processing.

## 🖥️ Screenshots

### Landing Page

<img width="1912" height="908" alt="image" src="https://github.com/user-attachments/assets/0205eefe-4614-4552-999d-e70efb2f2ceb" />
<img width="1917" height="906" alt="image" src="https://github.com/user-attachments/assets/d6b24bab-1530-4d22-9e3a-9459b89e716c" />
<img width="1907" height="917" alt="image" src="https://github.com/user-attachments/assets/92e6cffa-a15e-453b-8958-bcdff960783c" />




### Dashboard

<img width="1917" height="905" alt="image" src="https://github.com/user-attachments/assets/8630bb55-72a3-4906-a498-f90a2400baf4" />
<img width="1917" height="911" alt="image" src="https://github.com/user-attachments/assets/b153ca7e-1ab2-4aef-9771-7bb4c35b5f03" />



### Resume Analysis

<img width="1917" height="901" alt="image" src="https://github.com/user-attachments/assets/5603d05a-790d-43a6-b021-3c43b2a3245e" />
<img width="1917" height="907" alt="image" src="https://github.com/user-attachments/assets/8fbae11e-55d3-41dd-98e4-ee2ddb5b63a9" />



### AI Interview Preparation

<img width="1910" height="922" alt="image" src="https://github.com/user-attachments/assets/04dd6ab3-6f9c-4de4-b178-1a20b8a2a4e5" />
<img width="1901" height="901" alt="image" src="https://github.com/user-attachments/assets/64e84a09-5fff-49f8-a136-c523aa43a50f" />



## 🔄 How It Works

```text
User Signup
    ↓
Personalized Onboarding
    ↓
Resume Upload
    ↓
PDF/DOCX Text Extraction
    ↓
AI Resume Analysis
    ↓
Skills + Skill Gaps + Readiness
    ↓
Personalized Preparation Roadmap
    ↓
Interview Practice & Progress Tracking
```

## 🛠️ Tech Stack

### Frontend

* React 18
* Vite
* Tailwind CSS
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* JWT
* Cookie-Parser
* CORS

### Database

* MongoDB Atlas
* Mongoose

### AI

* Google Gemini API
* `@google/genai` / `@google/generative-ai`

### Resume Processing

* `pdf-parse`
* `mammoth`

### Deployment

* Vercel — Frontend
* Render — Backend

## 🏗️ Project Structure

```text
ai-powered-job-career-preparation-platform/
│
├── BACKEND/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── FRONTEND/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔐 Security & Reliability

* Server-side file type and size validation
* PDF/DOCX magic-byte validation
* In-memory resume text extraction
* Bounded resume text sent to the AI model
* Graceful handling of malformed or empty documents
* Protected authenticated routes
* Secure environment variable usage
* CORS configuration for frontend/backend communication
* AI failures do not produce unsupported resume insights

## ⚙️ Environment Variables

### Backend

Create `BACKEND/.env`:

```env
PORT=3000
MONGODB_URI=*****************
JWT_SECRET=*****************
GEMINI_API_KEY=*****************
GEMINI_MODEL=gemini-1.5-flash
FRONTEND_URL=https://ai-powered-job-career-preparation-p.vercel.app
```

### Frontend

Create `FRONTEND/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Never commit `.env` files or API keys to GitHub.

## 🚀 Local Development

### Clone the repository

```bash
git clone https://github.com/Mahak2357/-AI-Powered-Job-Career-Preparation-Platform.git
cd -AI-Powered-Job-Career-Preparation-Platform
```

### Start Backend

```bash
cd BACKEND
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

### Start Frontend

Open another terminal:

```bash
cd FRONTEND
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## 📡 API Overview

### Authentication

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Create a new account   |
| POST   | `/api/auth/login`    | Authenticate user      |
| GET    | `/api/auth/logout`   | End active session     |
| GET    | `/api/auth/get-me`   | Get authenticated user |

### Interview & Preparation

| Method | Endpoint             | Description                       |
| ------ | -------------------- | --------------------------------- |
| POST   | `/api/interview/`    | Generate personalized preparation |
| GET    | `/api/interview/:id` | Retrieve preparation report       |

## 🧪 Quality Checks

The project has been verified with:

* Backend syntax/diagnostic checks
* Frontend lint checks
* Production build verification
* PDF/DOCX extraction testing
* Malformed document handling
* AI analysis fallback handling



## 👩‍💻 Author

**Mahak**

https://www.linkedin.com/in/mahak1723 [connect with me]

Built as a full-stack AI career preparation project combining modern web development, backend engineering, AI integration, and production deployment.
