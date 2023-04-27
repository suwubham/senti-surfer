from typing import List
from fastapi import FastAPI
from nltk.sentiment import SentimentIntensityAnalyzer
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import os
import time

app = FastAPI()
load_dotenv() 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_sentiment(sentiment):
    if sentiment['pos'] > 0:
        return "Positive"
    if sentiment['neg'] > 0:
        return "Negative"
    else:
        return "Neutral"

def get_youtube_comments(videoId):
    base_url = 'https://www.googleapis.com/youtube/v3/commentThreads'
    comments = []
    params = {
        'part': 'snippet',
        'videoId': videoId,
        'key': os.getenv("YTAPI_KEY"),
        'textFormat': 'plainText',
        'maxResults': 100
    }

    response = requests.get(base_url, params=params)
    if response.status_code != 200:
        print(f'Response status code: {response.status_code}')
        return comments
    data = response.json()
    for item in data['items']:
        comment = item['snippet']['topLevelComment']['snippet']
        print(comment)
        comments.append({
            'textDisplay': comment['textDisplay'],
            'author': comment['authorDisplayName'],
            'date': comment['publishedAt'],
            'channelId': comment['authorChannelId']['value']
        })

    return comments

def get_channel_location(channelId):
    base_url = 'https://www.googleapis.com/youtube/v3/channels'
    params = {
        'key': os.getenv("YTAPI_KEY"),
        "part": "snippet",
        "id": channelId
    }

    response = requests.get(base_url, params=params)
    # Check if the response was successful
    try:
        if response.status_code == 200:
            location = response.json()["items"][0]["snippet"]["country"]
            return location
        else:
            return "Null"
    except:
        return "Null"

@app.post("/analyze-youtube-comments")
def get_comments(videoId : dict):
    comments = get_youtube_comments(videoId["videoId"])
    sia = SentimentIntensityAnalyzer()
    results = []
    for comment in comments:
        text = comment['textDisplay']
        sentiment = sia.polarity_scores(text)
        result = {
            'text': comment['textDisplay'],
            'author': comment['author'],
            'date': comment['date'],
            'positive': sentiment['pos'],
            'negative': sentiment['neg'],
            'neutral': sentiment['neu'],
            'compound': (sentiment['compound'] + 1) * 50,
            'sentiment': get_sentiment(sentiment),
            'channelId':comment['channelId'],
            'location':get_channel_location(comment['channelId'])
        }
        results.append(result)
    return results
