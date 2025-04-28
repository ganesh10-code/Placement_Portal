from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel
from utils import render_latex
# import uuid
import io
import pdfplumber
import os
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import requests
import google.generativeai as genai
from fastapi import UploadFile, File, Form
import json


  
genai.configure(api_key= "AIzaSyABxpQykqXM077ASrsvIyfY1k8rRd6z_hg")

app = FastAPI()

# Allow frontend on localhost:5173 (React)
origins = [
    "http://localhost:5173",  # React frontend
    "http://127.0.0.1:5173",  # Sometimes needed too
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] for all origins (less secure)
    allow_credentials=True,
    allow_methods=["*"],    # or ["POST", "GET"]
    allow_headers=["*"],
)

class ResumeRequest(BaseModel):
    studentData: dict
    template: str
    selectedSections: list[str]
    objective: Optional[str] = None


class ObjectiveRequest(BaseModel):
    profile: dict
    jobDescription: str


@app.post("/generate-resume")
def generate_resume(req: ResumeRequest):
    try:
        # Filter only selected sections
        filtered_data = {k: v for k, v in req.studentData.items() if k in req.selectedSections}
        filtered_data.update({
            "name": req.studentData.get("name"),
            "rollNo":req.studentData.get("rollNo"),
            "email": req.studentData.get("email"),
            "phoneNumber": req.studentData.get("phoneNumber"),
            "education": req.studentData.get("education"),
        })
        
        filtered_data["selectedSections"] = req.selectedSections
        filtered_data["objective"] = req.objective  
        cleaned_data = clean_data(filtered_data)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        fileName = f"{filtered_data['rollNo']}_resume_{timestamp}"
        pdf_path = render_latex(req.template, cleaned_data, fileName)

        return {"resumeId": fileName, "message": "Resume generated", "url": f"/preview/{fileName}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def clean_data(data):
    def strip_quotes(val):
        if isinstance(val, str):
            return val.strip('"')
        elif isinstance(val, list):
            return [strip_quotes(v) for v in val]
        elif isinstance(val, dict):
            return {k: strip_quotes(v) for k, v in val.items()}
        return val
    def sanitize_string(val, str):
        return val.strip().strip('"').strip("'")  

    return strip_quotes(data)

@app.get("/preview/{resume_id}")
def preview_resume(resume_id: str):
    pdf_path = f"generated/{resume_id}.pdf"
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="Resume not found")
    return FileResponse(pdf_path, media_type="application/pdf")

@app.post("/generate-objective")
async def generate_objective(req: ObjectiveRequest):
    profile = req.profile
    job_description = req.jobDescription

    try:
        prompt = f"Profile: {profile}\n\nJob Description: {job_description}\n\nWrite a short professional 2-3 line career objective for a resume."

        model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest")

        response = model.generate_content(prompt)

        if response.candidates:
            objective_text = response.candidates[0].content.parts[0].text
        else:
            raise Exception("No candidates returned from Gemini model")

        return {"success": True, "objective": objective_text.strip()}

    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/score-resume")
async def score_resume(resume: UploadFile = File(...), jobDescription: str = Form(...)):
    try:
        contents = await resume.read()
        file_name = resume.filename.lower()

        if file_name.endswith(".pdf"):
            with pdfplumber.open(io.BytesIO(contents)) as pdf:
                resume_text = "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())
        else:
            raise HTTPException(status_code=400, detail="Only PDF resumes are supported currently.")

        # Gemini prompt
        prompt = f"""
        You are a professional Career Coach and Resume Advisor.

        Given the RESUME and JOB DESCRIPTION below, provide a STRICT JSON output:

        {{
        "score": (integer 0-100),
        "verdict": ("Excellent fit" | "Good fit" | "Needs Improvement" | "Poor fit"),
        "missingSkills": [list of skills],
        "languageReview": "short paragraph",
        "gaps": [list of experience gaps],
        "topSuggestions": [5 specific resume improvements],
        "careerGuidance": "short paragraph"
        }}

        ONLY return valid JSON without any extra words.

        RESUME:
        {resume_text}

        JOB DESCRIPTION:
        {jobDescription}
        """

        model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest")
        response = model.generate_content(prompt)

        if not response.candidates:
            raise Exception("No candidates returned from Gemini.")

        raw_text = response.candidates[0].content.parts[0].text.strip()

        # --- THIS IS THE FIX ---
        # Extract JSON between first { and last }
        try:
            json_start = raw_text.index('{')
            json_end = raw_text.rindex('}') + 1
            json_text = raw_text[json_start:json_end]
        except ValueError:
            raise Exception("Could not find JSON object in Gemini response.")

        structured_data = json.loads(json_text)

        # Clamp score between 0-100
        score = structured_data.get("score", 0)
        score = max(0, min(score, 100))

        return {
            "score": score,
            "skillsMissing": structured_data.get("missingSkills", []),
            "gaps": structured_data.get("gaps", []),
            "suggestions": structured_data.get("topSuggestions", []),
            "languageReview": structured_data.get("languageReview", ""),
            "careerGuidance": structured_data.get("careerGuidance", ""),
            "verdict": structured_data.get("verdict", "")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scoring resume: {str(e)}")
