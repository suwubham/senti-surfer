from fastapi import APIRouter
import requests
from dotenv import load_dotenv
import os

load_dotenv() 
route_getytdetails = APIRouter()

@route_getytdetails.post("/get-youtube-details")
def get_yt_details(videoId : dict):
    base_url = 'https://www.googleapis.com/youtube/v3/videos'
    params = {
        'key': os.getenv("YTAPI_KEY"),
        'part': 'snippet,statistics',
        'id': videoId["videoId"]
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        data = response.json()
        thumbnail_url = data['items'][0]['snippet']['thumbnails']['medium']['url']
        uploader_name = data['items'][0]['snippet']['channelTitle']
        title = data['items'][0]['snippet']['title']
        view_count = data['items'][0]['statistics'].get('viewCount', 'N/A')
        photo_url = data['items'][0]['snippet']['thumbnails']['default']['url']
        likes_count = data['items'][0]['statistics'].get('likeCount', 'N/A')
        comments_count = data['items'][0]['statistics'].get('commentCount', 'N/A')
        
        return {
            "thumbnail_url": thumbnail_url,
            "uploader_name": uploader_name,
            "photo_url": photo_url,
            "likes_count": likes_count,
            "comments_count": comments_count,
            "title": title,
            "view_count": view_count,
        }
        
    else:
        return {"error": f"Request failed with error {response.status_code}: {response.text}"}
