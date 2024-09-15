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

@app.post("/upload_summary")
async def upload_summary(data: SummaryData):
    key = data.key
    timestamp = data.timestamp
    summary = data.summary

    sql = "INSERT INTO students (key, summary, timestamp) VALUES (?, ?, ?)"
    params = [key, summary, timestamp]

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