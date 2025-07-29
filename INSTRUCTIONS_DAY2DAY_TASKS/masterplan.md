AI Agent Prompt: Convert Python Streamlit App to React-Vite + FastAPI Application
Objective
You are tasked with converting an existing Python Streamlit tender management application into a modern web application using a React-Vite frontend and a FastAPI backend. The migration must follow the provided instructions in their exact chronology, as outlined in the documents (INSTRCTION 01, INSTRCTION 00, INSTRCTION 02, INSTRCTION 03, INSTRCTION 04-STAGE-REVIEW-v2, INSTRCTION 06-W2, INSTRCTION ABOUT OBJECTIVE, STANDING ORDER). The goal is to replicate the existing functionality (Excel upload, template downloads, office profile management) while addressing backend polish and setting up a scalable frontend. Below are the detailed steps, organized by the chronological order of the instructions.

Guardrails

Strict Compliance: Follow the instructions exactly as provided. Do not impose additional code or features unless explicitly warranted by the instructions.
Branching: Use the specified branches (week01-poc-fastapi for Week-01, week02-frontend for Week-02).
File Saving: Save all new files created without waiting for user consent, as per the standing order.
Chronology: Adhere to the sequence of tasks as they appear in the documents, starting with Week-01 (backend) and moving to Week-02 (frontend + backend polish).
Time-Boxing: Respect the time estimates provided (e.g., Week-01: 7 days, Week-02: 5 days).
Deployment: Ensure backend is deployable to Render and frontend to Vercel, with daily preview links for Week-02.
Artifacts: Wrap all generated code and files in <xaiArtifact> tags with unique UUIDs for new files, reusing artifact IDs for updates to existing files.


Week-01: FastAPI Backend POC (7 Days)
Context
The goal is to wrap the existing Streamlit app’s functionality (Excel upload, template downloads) into a FastAPI backend, deployed to Render. The instructions are sourced from INSTRCTION 01, INSTRCTION ABOUT OBJECTIVE, and INSTRCTION 04-STAGE-REVIEW-v2.
Tasks

Branch & Setup (Day 1):

Create branch: git checkout -b week01-poc-fastapi.
Set up project structure:backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── uploads.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── excel_parser.py
│   │   └── report_generator.py
│   └── models.py
└── tests/


Install dependencies: pip install fastapi uvicorn python-multipart pandas openpyxl sqlalchemy aiosqlite.


Refactor Existing Logic (Day 1):

Copy excel_parser.py to services/excel_parser.py and refactor into an async function: parse_excel(file: UploadFile) -> dict.
Copy report_generator.py to services/report_generator.py.
Write unit tests for excel_parser.py (ensure they pass).


Core Endpoints (Days 2–3):

Implement:
POST /api/v1/upload: Accept Excel files (single or 2-15 sheets), validate file type (.xlsx, .xls) and size (≤ 5 MB), return JSON preview identical to Streamlit.
GET /api/v1/download/{template}: Serve single_work_nit.xlsx or multi_work_nit.xlsx.
GET /api/v1/health: Return {"status": "ok"}.


Ensure Swagger UI (/docs) shows all endpoints with 200/422 responses.


Dockerization (Day 4):

Create Dockerfile with multi-stage build (remove dev packages like pytest in final image).
Create docker-compose.yml for hot-reload on localhost:8000.
Command: docker compose up --build.


Testing & CI (Day 5):

Add pytest tests for /upload and /health.
Include parameterized tests for edge cases (empty file, wrong extension, >5 MB).
Set up GitHub Actions workflow using python:3.11-slim, add actions/cache@v4 for pip caching.


Deployment (Day 6):

Deploy to Render (free tier):
Environment: Docker.
Branch: main.
Env vars: From .env.example.
Smoke-test: curl https://<render-host>/api/v1/health.


Ensure https://tender-poc.onrender.com/docs is live.


Documentation & Handoff (Day 7):

Update README.md with env vars and local run instructions.
Tag PR as week-01-poc and merge to main.


Backend Polish (from INSTRCTION 04-STAGE-REVIEW-v2):

Add .env to .gitignore.
Wrap pandas.read_excel in asyncio.to_thread to avoid blocking.
Add rate-limiting with slowapi or fastapi-limiter (e.g., 5/minute on /upload).
Move MAX_SIZE to settings.py using pydantic-settings.
Create exception_handlers.py for consistent JSON errors (e.g., HTTPException(status_code=422, detail={"loc": ..., "msg": ...})).
Add fastapi-security-headers middleware for X-Content-Type-Options, X-Frame-Options.
Use structlog for JSON logging.
Split requirements.txt into requirements.txt and requirements-dev.txt.
Tag fixes as v0.2.0 after merging.



Deliverables

Swagger UI live with all endpoints.
JSON response from /upload matches Streamlit preview.
CI checks green, PR tagged week-01-poc, deployed to Render.


Week-02: Frontend Kick-off & Backend Polish (5 Days)
Context
Build a React-Vite frontend to replicate Streamlit’s UI and polish the backend. Instructions are from INSTRCTION 00, INSTRCTION 03, and INSTRCTION 06-W2.
Tasks

Branch & Scaffold (Day 1, 09:00–10:00):

Create branch: git checkout -b week02-frontend.
Run: npm create vite@latest tender-frontend --template react-ts.
Install dependencies: npm i axios react-hook-form @tanstack/react-query recharts react-hot-toast.
Install dev dependencies: npm i -D @types/react @types/react-dom autoprefixer tailwindcss postcss.
Configure Tailwind:// tender-frontend/tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}

/* tender-frontend/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;


Generate TypeScript types: npx openapi-typescript http://localhost:8000/openapi.json --output src/types/api.d.ts.


API Layer (Day 1, 10:00–11:00):

Create src/lib/api.ts:import；





System: You are Grok 3 built by xAI.
It looks like your prompt was cut off, possibly due to a character limit. The instruction asks for a markdown prompt to guide an AI agent in converting a Python Streamlit app to a React-Vite + FastAPI application, following the provided documents in their chronological order. Since the prompt was truncated at the src/lib/api.ts section, I'll complete the markdown prompt, ensuring all instructions from the documents (INSTRCTION 01, INSTRCTION 00, INSTRCTION 02, INSTRCTION 03, INSTRCTION 04-STAGE-REVIEW-v2, INSTRCTION 06-W2, INSTRCTION ABOUT OBJECTIVE, STANDING ORDER) are addressed in their specified order, with all code wrapped in <xaiArtifact> tags.


AI Agent Prompt: Convert Python Streamlit App to React-Vite + FastAPI Application
Objective
You are tasked with converting an existing Python Streamlit tender management application into a modern web application using a React-Vite frontend and a FastAPI backend. The migration must follow the provided instructions in their exact chronology, as outlined in the documents (INSTRCTION 01, INSTRCTION 00, INSTRCTION 02, INSTRCTION 03, INSTRCTION 04-STAGE-REVIEW-v2, INSTRCTION 06-W2, INSTRCTION ABOUT OBJECTIVE, STANDING ORDER). The goal is to replicate the existing functionality (Excel upload, template downloads, office profile management) while addressing backend polish and setting up a scalable frontend. Below are the detailed steps, organized by the chronological order of the instructions.

Guardrails

Strict Compliance: Follow the instructions exactly as provided. Do not impose additional code or features unless explicitly warranted by the instructions.
Branching: Use the specified branches (week01-poc-fastapi for Week-01, week02-frontend for Week-02).
File Saving: Save all new files created without waiting for user consent, as per the standing order.
Chronology: Adhere to the sequence of tasks as they appear in the documents, starting with Week-01 (backend) and moving to Week-02 (frontend + backend polish).
Time-Boxing: Respect the time estimates provided (e.g., Week-01: 7 days, Week-02: 5 days).
Deployment: Ensure backend is deployable to Render and frontend to Vercel, with daily preview links for Week-02.
Artifacts: Wrap all generated code and files in <xaiArtifact> tags with unique UUIDs for new files, reusing artifact IDs for updates to existing files.


Week-01: FastAPI Backend POC (7 Days)
Context
The goal is to wrap the existing Streamlit app’s functionality (Excel upload, template downloads) into a FastAPI backend, deployed to Render. The instructions are sourced from INSTRCTION 01, INSTRCTION ABOUT OBJECTIVE, and INSTRCTION 04-STAGE-REVIEW-v2.
Tasks

Branch & Setup (Day 1):

Create branch: git checkout -b week01-poc-fastapi.
Set up project structure:backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── uploads.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── excel_parser.py
│   │   └── report_generator.py
│   └── models.py
└── tests/


Install dependencies: pip install fastapi uvicorn python-multipart pandas openpyxl sqlalchemy aiosqlite.


Refactor Existing Logic (Day 1):

Copy excel_parser.py to services/excel_parser.py and refactor into an async function: parse_excel(file: UploadFile) -> dict.
Copy report_generator.py to services/report_generator.py.
Write unit tests for excel_parser.py (ensure they pass).


Core Endpoints (Days 2–3):

Implement:
POST /api/v1/upload: Accept Excel files (single or 2-15 sheets), validate file type (.xlsx, .xls) and size (≤ 5 MB), return JSON preview identical to Streamlit.
GET /api/v1/download/{template}: Serve single_work_nit.xlsx or multi_work_nit.xlsx.
GET /api/v1/health: Return {"status": "ok"}.


Ensure Swagger UI (/docs) shows all endpoints with 200/422 responses.


Dockerization (Day 4):

Create Dockerfile with multi-stage build (remove dev packages like pytest in final image).
Create docker-compose.yml for hot-reload on localhost:8000.
Command: docker compose up --build.


Testing & CI (Day 5):

Add pytest tests for /upload and /health.
Include parameterized tests for edge cases (empty file, wrong extension, >5 MB).
Set up GitHub Actions workflow using python:3.11-slim, add actions/cache@v4 for pip caching.


Deployment (Day 6):

Deploy to Render (free tier):
Environment: Docker.
Branch: main.
Env vars: From .env.example.
Smoke-test: curl https://<render-host>/api/v1/health.


Ensure https://tender-poc.onrender.com/docs is live.


Documentation & Handoff (Day 7):

Update README.md with env vars and local run instructions.
Tag PR as week-01-poc and merge to main.


Backend Polish (from INSTRCTION 04-STAGE-REVIEW-v2):

Add .env to .gitignore.
Wrap pandas.read_excel in asyncio.to_thread to avoid blocking.
Add rate-limiting with slowapi or fastapi-limiter (e.g., 5/minute on /upload).
Move MAX_SIZE to settings.py using pydantic-settings.
Create exception_handlers.py for consistent JSON errors (e.g., HTTPException(status_code=422, detail={"loc": ..., "msg": ...})).
Add fastapi-security-headers middleware for X-Content-Type-Options, X-Frame-Options.
Use structlog for JSON logging.
Split requirements.txt into requirements.txt and requirements-dev.txt.
Tag fixes as v0.2.0 after merging.



Deliverables

Swagger UI live with all endpoints.
JSON response from /upload matches Streamlit preview.
CI checks green, PR tagged week-01-poc, deployed to Render.


Week-02: Frontend Kick-off & Backend Polish (5 Days)
Context
Build a React-Vite frontend to replicate Streamlit’s UI and polish the backend. Instructions are from INSTRCTION 00, INSTRCTION 03, INSTRCTION 06-W2, and INSTRCTION 02 for office profile integration.
Tasks

Branch & Scaffold (Day 1, 09:00–10:00):

Create branch: git checkout -b week02-frontend.
Run: npm create vite@latest tender-frontend --template react-ts.
Install dependencies: npm i axios react-hook-form @tanstack/react-query recharts react-hot-toast.
Install dev dependencies: npm i -D @types/react @types/react-dom autoprefixer tailwindcss postcss.
Configure Tailwind:// tender-frontend/tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}

/* tender-frontend/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;


Generate TypeScript types: npx openapi-typescript http://localhost:8000/openapi.json --output src/types/api.d.ts.


API Layer (Day 1, 10:00–11:00):

Create src/lib/api.ts:import axios from 'axios';
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});




Query Client & Router (Day 1, 11:00–12:00):

Create src/lib/queryClient.ts:import { QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
});


Create src/App.tsx:import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import UploadPage from './pages/UploadPage';
import DownloadPage from './pages/DownloadPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/download" element={<DownloadPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;




Upload Page (Day 1 13:00–Day 2 12:00):

Create src/pages/UploadPage.tsx:import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { api } from '../lib/api';

type Form = { file: FileList };

export default function UploadPage() {
  const { register, handleSubmit } = useForm<Form>();

  const onSubmit = async ({ file }: Form) => {
    const form = new FormData();
    form.append('file', file[0]);
    try {
      const { data } = await api.post('/upload', form);
      toast.success(`Parsed ${data.rows.length} rows`);
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-4 max-w-md mx-auto">
      <input type="file" accept=".xlsx,.xls" {...register('file', { required: true })} />
      <button className="btn btn-primary">Upload & Preview</button>
    </form>
  );
}




Download Page (Day 2 13:00–Day 3 12:00):

Create src/pages/DownloadPage.tsx:import { api } from '../lib/api';
export default function DownloadPage() {
  return (
    <div className="p-8 space-x-4 text-center">
      <a href={`${api.defaults.baseURL}/download/single_work_nit.xlsx`} download
         className="btn btn-outline">Single-Work NIT</a>
      <a href={`${api.defaults.baseURL}/download/multi_work_nit.xlsx`} download
         className="btn btn-outline">Multi-Work NIT</a>
    </div>
  );
}




Backend Polish (Day 2 13:00–Day 3 17:00):

Update app/main.py for CORS and rate-limiting:from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
import aioredis

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    redis = await aioredis.create_redis_pool("redis://localhost")
    await FastAPILimiter.init(redis)

@app.post("/upload", dependencies=[Depends(RateLimiter(times=10, seconds=60))])
async def upload_file():
    pass  # Existing upload logic


Create .env.example:REDIS_URL=redis://localhost:6379


Install dependencies: pip install fastapi-limiter aioredis.


Office Profile Integration (from INSTRCTION 02):

Run SQL migration for office profiles:CREATE TABLE office_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  office_name TEXT, address TEXT,
  seal_path TEXT, letterhead_path TEXT,
  nit_header TEXT, nit_footer TEXT
);
INSERT OR IGNORE INTO office_profiles
  (user_id, office_name, address, seal_path, letterhead_path, nit_header, nit_footer)
VALUES
  (1, 'Office O-1', '123 Secretariat Avenue, Capital City – 110001',
   'static/seals/o1_seal.png', 'static/letterheads/o1_letterhead.png',
   'GOVERNMENT OF …<br>Office of the Executive Engineer (O-1)<br>NIT No. ______ / EE / 2025-26',
   'For and on behalf of the Governor,<br>(Signature & Seal)<br>Executive Engineer (O-1)');


Ensure generated PDFs pull header, footer, seal, and letterhead from office_profiles.


Dev & Build Scripts (Day 3 18:00):

Create root package.json:{
  "scripts": {
    "dev tartaruga": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "docker compose up --build",
    "dev:frontend": "cd tender-frontend && npm run dev",
    "build": "cd tender-frontend && npm run build && cp -r dist ../backend/static"
  }
}


Install: npm i -D concurrently.


Vercel Auto-Deploy (Day 4 09:00–10:00):

Create tender-frontend/vercel.json:{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm ci"
}


Push to Vercel for daily preview links.


Security & Monitoring (Day 4–5):

Backend: Add prometheus-fastapi-instrumentator for /metrics.
Frontend: Add .env with VITE_API_URL=https://api.tender.app.


Week-02 Done Definition (Day 5):

All routes accessible via React UI.
Rate-limiting, CORS, and .env fixes merged.
Vercel preview URL shared daily.
PR week02-frontend approved and merged by Friday 18:00.



Deliverables

React-Vite frontend with UploadPage and DownloadPage.
Backend with CORS, rate-limiting, and security headers.
Vercel preview links and merged PR.


Additional Notes

Migration Phases (INSTRCTION 00):
Week-01: FastAPI POC (complete).
Week-02: React UI (UploadPage, DownloadPage).
Week-03: Feature parity (profile editing, template downloads).
Week-04: Polish (auth, RBAC, dark mode, CI/CD).


Re-use Logic:
excel_parser.py → services/excel_parser.py.
report_generator.py → services/report_generator.py.
Streamlit widgets → React components (<FileUpload />, <DataTable />).


Deployment:
Backend: Render (Docker, main branch).
Frontend: Vercel (push tender-frontend for previews).


Standing Order: Save all files immediately, push early, and tag PRs for review.
