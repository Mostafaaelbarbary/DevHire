from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Application, Job, User
from app.schemas.schemas import ApplicationCreate, ApplicationOut
from app.routers.auth import get_current_user

router = APIRouter(prefix="/applications", tags=["applications"])

@router.post("", response_model=ApplicationOut)
def apply_to_job(payload: ApplicationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can apply")
    job = db.query(Job).filter(Job.id == payload.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    existing = db.query(Application).filter(Application.candidate_id == current_user.id, Application.job_id == payload.job_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied")
    app = Application(candidate_id=current_user.id, job_id=payload.job_id, cover_letter=payload.cover_letter)
    db.add(app)
    db.commit()
    db.refresh(app)
    return app

@router.get("/mine", response_model=list[ApplicationOut])
def my_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "candidate":
        return db.query(Application).filter(Application.candidate_id == current_user.id).all()
    jobs = db.query(Job.id).filter(Job.owner_id == current_user.id).subquery()
    return db.query(Application).filter(Application.job_id.in_(jobs)).all()
