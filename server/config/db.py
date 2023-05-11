from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv() 

mongodb_client = MongoClient(os.getenv("MONGODB_URI"))
db = mongodb_client["Test"]