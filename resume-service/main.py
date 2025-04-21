from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel
from utils import render_latex
# import uuid
import os
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware


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
