from fastapi import APIRouter
from firebase_config import db

router = APIRouter()

@router.get("/today_plan/{user_id}")
def today_plan(user_id: str):
    doc = db.collection("surveys").document(user_id).get()
    if not doc.exists:
        return {"error": "설문 없음"}

    data = doc.to_dict()
    subjects = data.get("subjects", [])
    study_details = data.get("studyDetails", "")
    target_date = data.get("targetDate", "")
    confidence = data.get("confidence", {})
    available_time = data.get("availableTime", {})

    if not subjects or not target_date:
        return {"error": "필수 데이터 누락"}

    return {
        "user_id": user_id,
        "subjects": subjects,
        "studyDetails": study_details,
        "targetDate": target_date,
        "confidence": confidence,
        "availableTime": available_time
    }