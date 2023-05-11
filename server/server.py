from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.getytdetails import route_getytdetails
from routes.analyzesentiment import route_analyzeytsentiment

app = FastAPI()

app.include_router(route_getytdetails)
app.include_router(route_analyzeytsentiment)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

