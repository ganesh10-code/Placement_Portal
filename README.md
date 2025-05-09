﻿# Placement Portal

A full-stack **MERN-based** Placement Portal for colleges to manage placement activities including **job postings**, **student applications**, **admin control**, **email automation**, and **resume generation**.

---

## Features

### 👥 Authentication & Authorization

- Admin and Student login system
- JWT-based access token (`15min`) and refresh token (`7 days`) with auto-refresh
- OTP-based **Forgot Password** flow
- Initial admin auto-creation if none exists
- Secure token verification middleware
- Rate limiting for login and OTP endpoints

---

### Admin Functionalities

- Add and view Admins
- Add and view Students (with education info)
- Add and view Companies (with `isPopular` flag)
- Add and view Jobs (with eligibility filters)
- View job listings by company
- View all applications (with student info)
- Update application status (`Pending`, `Accepted`, `Rejected`)

### Smart Email Automation

- **Popular Companies** → Email all students
- **Smaller Companies**:
  - No email if student has 2 offers
  - Email if new offer ≥ 1.5× student’s highest existing offer
  - Always email students with 0 offers

---

### Student Functionalities

- Login using roll number and password
- View and edit profile (skills, certifications, projects, experience, social links)
- Upload, view, and delete resume (PDF only)
- View eligible jobs based on CGPA and branch
- Apply for jobs (with eligibility check)
- Withdraw applications
- Track job application status

---

### 📄 Resume Generator (Microservice - Python)

- FastAPI service for LaTeX → PDF resume generation
- Multiple templates planned
- Customization: fonts, sections, colors
- Future integration with frontend for download

---

## 🛠️ Tech Stack

| Layer          | Tools / Libraries                             |
| -------------- | --------------------------------------------- |
| **Frontend**   | React + Vite + Tailwind CSS                   |
| **Backend**    | Node.js + Express                             |
| **Database**   | MongoDB (Mongoose ODM)                        |
| **Auth**       | JWT + Refresh Tokens                          |
| **Email**      | Nodemailer (Gmail SMTP)                       |
| **Security**   | bcrypt, express-rate-limit, HTTP-only cookies |
| **Resume Gen** | FastAPI, Python, LaTeX, PDFKit (future-ready) |

---

## 🗂️ Project Structure

```
Placement_Portal/
├── backend/                # Node + Express API
│   ├── controllers/        # Admin, Auth, Student
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth, RateLimit, Upload
│   ├── uploads/resumes/    # Uploaded PDFs
│   └── index.js            # Entry point
├── frontend/               # React (Vite + Tailwind)
│   ├── components/forms/   # AddAdmin, AddJob, AddStudent, etc.
│   ├── utilities/          # API utilities
│   └── App.jsx             # App Entry
├── resume-services/        # (Python) Resume generation microservice
```

---

## 🔒 Security Features

- Password hashing with `bcrypt`
- OTP expires after 5 minutes
- Token verification middleware
- Refresh token stored as HTTP-only cookie
- Rate limiting to prevent brute-force login/OTP abuse

---

## ⚙️ Future Improvements

- 🌐 Resume download from frontend UI
- 📊 Dashboard analytics (charts for job offers, student stats)
- 🔍 Search & Filter for jobs and students
- 🖼️ Resume template selection UI
- 📁 Switch to cloud storage (e.g., S3) for resumes
- 🧠 AI-based resume builder (planned)

---

## 🧪 Local Setup

### 1. Backend

```bash
cd backend
npm install
# Configure .env with Mongo URI, JWT keys, email credentials
node index.js
```

### 2. Frontend

```bash
cd frontend
cd dashboard
npm install
npm run dev
```

### 3. Resume Microservice (optional)

```bash
cd resume-services
python -m venv venv (Windows)  # or python3 -m venv venv (MacOS)
.\venv\Scripts\activate (Windows)    # or  source venv/bin/activate (MacOS)
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 📬 Contact

For any issues or suggestions, feel free to reach out.  
Contact -
M.Seshadri Naidu (seshmanuvarthi27@gmail.com)
B.Pujith Ganesh (borraganesh10@gmail.com)

Happy Coding!
