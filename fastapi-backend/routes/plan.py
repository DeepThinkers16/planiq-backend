from fastapi import APIRouter
from datetime import datetime, timedelta
from firebase_config import db

router = APIRouter()

@router.get("/today_plan/{user_id}")
def today_plan(user_id: str):
    doc = db.collection("surveys").document(user_id).get()
    if not doc.exists:
        return {"error": "설문 없음"}

    data = doc.to_dict()

    subjects = data.get("subjects", [])
    # study_details_raw = data.get("studyDetails", "")
    target_date_str = data.get("targetDate", None)
    # confidence_data = data.get("confidence", {})  # 예: {"국어": 2, "수학": 4, "영어": 5}

    if not target_date_str or not subjects:
        return {"error": "필수 데이터 누락"}

    # D-day 계산
    target_date = datetime.strptime(target_date_str, "%Y-%m-%d").date()
    today = datetime.today().date()
    d_day = (target_date - today).days

    if d_day <= 0:
        return {"error": "이미 D-day가 지났습니다."}

    # detail_map = {}
    # for entry in study_details_raw.split(','):
    #     if ':' in entry:
    #         subj, task = entry.strip().split(':', 1)
    #         detail_map[subj.strip()] = task.strip()

    # weights = {}
    # total_weight = 0
    # for subj in subjects:
    #     conf = int(confidence_data.get(subj, 3))  # default는 3
    #     weight = 6 - conf  # 자신감 낮을수록 높게
    #     weights[subj] = weight
    #     total_weight += weight

    # 임시 설정: 모든 과목 동일 가중치, 디폴트 내용
    weights = {subj: 1 for subj in subjects}
    total_weight = len(subjects)
    detail_map = {subj: "학습" for subj in subjects}

    # 전체 task 수 = D-day 기준으로 하루 1 task씩 잡음 (단순화)
    total_tasks = d_day

    # 과목별 task 수 배분
    plan_count = {}
    for subj in subjects:
        ratio = weights[subj] / total_weight
        plan_count[subj] = round(ratio * total_tasks)

    # 날짜별 계획 생성
    daily_plan = []
    current_date = today
    subject_index = {subj: 1 for subj in subjects}  # 각 과목 몇 번째 task인지

    for _ in range(d_day):
        day_plan = []
        for subj in subjects:
            if plan_count[subj] > 0:
                task_number = subject_index[subj]
                content = detail_map.get(subj, "학습")
                day_plan.append(f"{subj}: {content} - {task_number}일차")
                subject_index[subj] += 1
                plan_count[subj] -= 1
        daily_plan.append({"date": str(current_date), "tasks": day_plan})
        current_date += timedelta(days=1)

    return {"d_day": d_day, "plan": daily_plan}
