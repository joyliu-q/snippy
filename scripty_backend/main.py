import json
from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
import os
from typing import Any, Dict
import iris
from sentence_transformers import SentenceTransformer
import numpy as np


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
    
@app.post("/upload_embedding")
async def upload_embedding(data: SummaryData):
    key = data.key
    timestamp = data.timestamp
    summary = data.summary

    embedding = model.encode(summary).tolist()

    try:
        # Convert the embedding to a comma-separated string
        embedding_vector = ','.join(map(str, embedding))  # Assuming `embedding` is a numpy array

        # Define the SQL insert statement
        sql = """
        INSERT INTO students_embeddings (key, embedding, timestamp) 
        VALUES (?, TO_VECTOR(?, 'DOUBLE'), TO_TIMESTAMP(?, 'YYYY-MM-DD HH24:MI:SS.FF'))
        """

        # Prepare the parameters
        params = [key, embedding_vector, timestamp]

        # Execute the SQL statement
        cursor = conn.cursor()
        cursor.execute(sql, params)
        conn.commit()  # Commit the transaction
        cursor.close() # Close the cursor
        print("Record inserted successfully")
    except Exception as e:
        conn.rollback()  # Rollback in case of error
        print(f"Error inserting record: {str(e)}")


@app.get("/retrieve_by_embedding")
async def retrieve_by_embedding(data: EmbeddingData):
    summary = data.summary
    num = data.num

    issueDescription_vector = model.encode(summary, normalize_embeddings=True).tolist()
    vector_as_np_array = np.array(issueDescription_vector, dtype=np.float32)  # Ensure correct dtype
        # If the database accepts binary, you might do:
    vector_as_binary = vector_as_np_array.tobytes()

    try:
        sql = """
    SELECT TOP ? key, summary, timestamp 
    FROM students_summary 
    ORDER BY VECTOR_DOT_PRODUCT(summary, ?) DESC
    """
        cursor.execute(sql,[num, vector_as_binary])
        fetched_data = cursor.fetchall()
        return {"data": fetched_data}
    except Exception as e:
        raise {"error": str(e)}


@app.on_event("shutdown")
def shutdown():
    cursor.close()
    conn.close()