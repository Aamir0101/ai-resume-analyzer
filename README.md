# ResumeIQ — AI Resume Analyser

A full-stack AI-powered resume analyser with ATS scoring, skill gap analysis, and automated rewriting using Google Gemini.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express.js |
| AI | Google Gemini 3.5 Flash |
| PDF Parsing | pdf-parse (Node.js) |
| Database | MongoDB + Mongoose |
| Deployment | Railway + MongoDB Atlas |

## Features

- **PDF Upload** — Drag & drop or click to upload resume
- **Text Extraction** — Server-side PDF parsing with pdf-parse
- **ATS Score** — 0–100 score with section breakdown
- **Strengths & Weaknesses** — AI-identified resume quality factors
- **JD Matching** — Optional job description for targeted analysis
- **Skill Gap Analysis** — Missing skills vs job requirements
- **Keyword Analysis** — ATS keyword presence and gaps
- **AI Rewrite** — Full resume rewrite fixing all identified issues
- **Download** — Export improved resume as .txt

---

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key (free at aistudio.google.com)

### 1. Clone & Install

```bash
git clone <your-repo>
cd resume-analyser

# Install root dependencies
npm install

# Install all sub-project dependencies
npm run install:all
```

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/resume-analyser
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Get Gemini API key:** https://aistudio.google.com/app/apikey (free)

**Get MongoDB URI:** Create a free cluster at https://cloud.mongodb.com

### 3. Run Development Servers

```bash
# From the root directory — runs both frontend and backend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

---

## Deployment on Railway

### Backend

1. Push code to GitHub
2. Create a new **Web Service** on Railway
3. Connect your repository
4. Set:
   - **Build Command:** `npm install --prefix backend`
   - **Start Command:** `npm start --prefix backend`
5. Add environment variables:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `FRONTEND_URL` (your Netlify/Vercel frontend URL)
   - `NODE_ENV=production`

### Frontend (Netlify recommended)

1. Create a new site on Netlify
2. Connect your repository
3. Set:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. Add environment variable:
   - `VITE_API_URL=https://your-railway-backend.up.railway.com`
5. Update `frontend/src/utils/api.js` baseURL to use `import.meta.env.VITE_API_URL`

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/resume/upload` | Upload PDF, extract text |
| GET | `/api/resume/:id` | Get resume by ID |
| POST | `/api/analysis/analyze` | Run AI analysis |
| POST | `/api/analysis/rewrite` | Rewrite resume with AI |
| GET | `/api/analysis/download/:id` | Download improved resume |
| GET | `/api/health` | Health check |

---

## Project Structure

```
resume-analyser/
├── backend/
│   ├── controllers/
│   │   ├── resumeController.js    # Upload & extract
│   │   └── analysisController.js  # AI analysis & rewrite
│   ├── middleware/
│   │   └── upload.js              # Multer PDF handler
│   ├── models/
│   │   └── Resume.js              # Mongoose schema
│   ├── routes/
│   │   ├── resume.js
│   │   └── analysis.js
│   ├── utils/
│   │   ├── geminiService.js       # Gemini AI integration
│   │   └── pdfExtractor.js        # PDF text extraction
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── UploadZone.jsx
│       │   ├── ScoreRing.jsx
│       │   ├── SectionScores.jsx
│       │   ├── AnalysisPanel.jsx
│       │   └── RewritePanel.jsx
│       ├── pages/
│       │   └── Home.jsx
│       └── utils/
│           └── api.js
└── render.yaml
```

---

## Notes

- Resumes are auto-deleted from MongoDB after 24 hours (TTL index)
- Only PDF files are accepted (max 5MB)
- Scanned/image PDFs may not extract correctly — text-based PDFs work best
- Gemini 3.5 Flash is used for speed and cost efficiency
