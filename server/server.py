from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pymongo import MongoClient
import os
from routes.getytdetails import route_getytdetails
from routes.analyzesentiment import route_analyzeytsentiment

app = FastAPI()
load_dotenv() 

app.include_router(route_getytdetails)
app.include_router(route_analyzeytsentiment)

@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient(os.getenv("MONGODB_URI"))
    app.database = app.mongodb_client["Test"]
    app.mongodb_client.admin.command('ping')
    try:
        app.mongodb_client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

