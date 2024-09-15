from fastapi import FastAPI
from pydantic import BaseModel
import iris
from datetime import datetime
import os

app = FastAPI()

namespace="USER"
port = 1972
hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
connection_string = f"{hostname}:{port}/{namespace}"
username = "demo"
password = "demo"

conn = iris.connect(connection_string, username, password)
cursor = conn.cursor()

class SummaryData(BaseModel):
    key: str
    timestamp: str
    summary: str

class ScoreData(BaseModel):
    timestamp: str
    readability: int
    syntax: int
    practice: int

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

    print(timestamp)

    sql = "INSERT INTO students_score (timestamp, readability, syntax, practice) VALUES (TO_TIMESTAMP(?, 'YYYY-MM-DD HH24:MI:SS.FF'), ?, ?, ?)"
    params = [timestamp, readability, syntax, practice]
    try:
        cursor.execute(sql, params)
        conn.commit()
        return {"message": "Record inserted successfully"}
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}

@app.on_event("shutdown")
def shutdown():
    cursor.close()
    conn.close()