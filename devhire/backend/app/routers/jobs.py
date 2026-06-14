from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Job, User
from app.schemas.schemas import JobCreate, JobOut
from app.routers.auth import get_current_user

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("", response_model=list[JobOut])
def list_jobs(search: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Job)
    if search:
        query = query.filter(Job.title.ilike(f"%{search}%"))
    jobs = query.order_by(Job.created_at.desc()).all()
    result = []
    for job in jobs:
        obj = JobOut.model_validate(job)
        obj.company_name = job.owner.company_name or job.owner.name
        result.append(obj)
    return result

@router.post("", response_model=JobOut)
def create_job(payload: JobCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "company":
        raise HTTPException(status_code=403, detail="Only company users can post jobs")
    job = Job(**payload.model_dump(), owner_id=current_user.id)
    db.add(job)
    db.commit()
    db.refresh(job)
    output = JobOut.model_validate(job)
    output.company_name = current_user.company_name or current_user.name
    return output

@router.delete("/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(job)
    db.commit()
    return {"message": "Job deleted"}
