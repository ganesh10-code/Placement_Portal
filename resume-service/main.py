from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel
from utils import render_latex
import uuid
import os

app = FastAPI()

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
            "email": req.studentData.get("email"),
            "phoneNumber": req.studentData.get("phoneNumber"),
            "education": req.studentData.get("education"),
        })

        unique_id = str(uuid.uuid4())
        pdf_path = render_latex(req.template, filtered_data, unique_id)

        return {"resumeId": unique_id, "message": "Resume generated", "url": f"/preview/{unique_id}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/preview/{resume_id}")
def preview_resume(resume_id: str):
    pdf_path = f"generated/{resume_id}.pdf"
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="Resume not found")
    return FileResponse(pdf_path, media_type="application/pdf")
