from google.cloud import firestore
import os

# 서비스 계정 키 경로
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "../firebase-backend/serviceAccountKey.json"

db = firestore.Client()
