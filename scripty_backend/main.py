from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
import os
from typing import Any, Dict
import iris
from sentence_transformers import SentenceTransformer

app = FastAPI()

namespace="USER"
port = 1972
hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
connection_string = f"{hostname}:{port}/{namespace}"
username = "demo"
password = "demo"

conn = iris.connect(connection_string, username, password)
cursor = conn.cursor()

model = SentenceTransformer('all-MiniLM-L6-v2')

class SummaryData(BaseModel):
    key: str
    timestamp: str
    summary: str

class ScoreData(BaseModel):
    timestamp: str
    readability: int
    syntax: int
    practice: int

class EmbeddingData(BaseModel):
    summary: str
    num: int

@app.post("/upload_summary")
async def upload_summary(data: SummaryData):
    key = data.key
    timestamp = data.timestamp
    summary = data.summary

    sql = "INSERT INTO students_summary (key, summary, timestamp) VALUES (?, ?, TO_TIMESTAMP(?, 'YYYY-MM-DD HH24:MI:SS.FF'))"
    params = [key, summary, timestamp]

    try:
        cursor.execute(sql, params)
        conn.commit()
        return {"message": "Record inserted successfully"}
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}
    
@app.post("/upload_scores")
async def upload_score(data: ScoreData):
    timestamp = data.timestamp
    readability = data.readability
    syntax = data.syntax
    practice = data.practice
    

    sql = "INSERT INTO students_score (timestamp, readability, syntax, practice) VALUES (TO_TIMESTAMP(?, 'YYYY-MM-DD HH24:MI:SS.FF'), ?, ?, ?)"
    params = [timestamp, readability, syntax, practice]
    try:
        cursor.execute(sql, params)
        conn.commit()
        return {"message": "Record inserted successfully"}
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}
    
@app.get("/retrieve_by_embedding")
async def retrieve_by_embedding(EmbeddingData):
    summary = EmbeddingData.summary
    num = EmbeddingData.num

    issueDescription_vector = model.encode(summary, normalize_embeddings=True).tolist()
    try:
        sql = "select Top ? key, summary, timestamp from students_summary ORDER BY VECTOR_DOT_PRODUCT(summary, TO_VECTOR(?)) DESC"
        cursor.execute(sql,[num,str(issueDescription_vector)])
        fetched_data = cursor.fetchall()
        return {"data": fetched_data}
    except Exception as e:
        raise {"error": str(e)}


@app.on_event("shutdown")
def shutdown():
    cursor.close()
    conn.close()