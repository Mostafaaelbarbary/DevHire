# DevHire — Full Stack Job Board Platform

DevHire is a production-style full stack job board built to demonstrate software engineering skills for junior Software Engineer and Full Stack Engineer roles.

## Features

- Candidate and company user roles
- JWT-based authentication
- Company dashboard for posting jobs
- Candidate job browsing and applications
- RESTful API design
- Relational data model: users, jobs, applications
- Frontend-backend integration
- SQLite for local development, easily replaceable with PostgreSQL

## Tech Stack

**Frontend:** React, Vite, React Router, Axios  
**Backend:** FastAPI, SQLAlchemy, JWT Auth  
**Database:** SQLite locally / PostgreSQL-ready  
**Tools:** Git, REST APIs, modular project structure

## Project Structure

```text
devhire/
  backend/
    app/
      core/
      models/
      routers/
      schemas/
      database.py
      main.py
  frontend/
    src/
      services/
      main.jsx
      style.css
  docs/
```

## Run Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend will run on:

```text
http://localhost:8000
```

API docs:

```text
http://localhost:8000/docs
```

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

## Suggested Improvements

Use these to make the project stronger before adding it to your CV:

- Replace SQLite with PostgreSQL
- Add job editing page
- Add application status updates for companies
- Add protected routes in React
- Add unit tests for backend services
- Add Docker Compose
- Deploy frontend on Vercel and backend on Render/Railway

## CV Bullets

**DevHire — Full Stack Job Board Platform**

- Developed a full-stack job board platform with role-based authentication for candidates and companies.
- Built RESTful APIs for user authentication, job posting, and application tracking using FastAPI and SQLAlchemy.
- Designed a relational database model connecting users, job posts, and applications.
- Implemented a responsive React frontend with job browsing, application submission, and dashboard views.
- Integrated JWT authentication and protected backend endpoints based on user roles.

## GitHub Description

A full-stack job board platform built with React and FastAPI, featuring JWT authentication, role-based access, job posting, and candidate applications.
