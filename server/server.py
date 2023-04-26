from typing import List
from fastapi import FastAPI
from nltk.sentiment import SentimentIntensityAnalyzer
from fastapi.middleware.cors import CORSMiddleware
import requests
import pandas as pd
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

def get_sentiment(row):
    if row["positive"] > 0:
        return "Positive"
    if row["negative"] > 0:
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
        comments.append({
            comment['textDisplay']: {
                'author': comment['authorDisplayName'],
                'date': comment['publishedAt']
            }
        })

    return comments

@app.post("/analyze-youtube-comments")
def get_comments(videoId : dict):
    comments = get_youtube_comments(videoId["videoId"])
    sia = SentimentIntensityAnalyzer()
    results = pd.DataFrame(columns=["positive", "negative", "neutral", "compound"])
    for comment in comments:
        text = list(comment.keys())[0]
        sentiment = sia.polarity_scores(text)
        results.loc[text] = [
            sentiment['pos'],
            sentiment['neg'],
            sentiment['neu'],
            sentiment['compound']
        ]
    results['compound'] = (results['compound'] + 1) * 50
    results["sentiment"] = results.apply(get_sentiment, axis = 1)
    time.sleep(3)
    results.to_csv("data.csv")
    return results.to_dict(orient='index')

@app.post("/analyze-sentiment")
def analyze_sentiment(sentences: List[str]):
    sia = SentimentIntensityAnalyzer()
    results = pd.DataFrame(columns=["positive", "negative", "neutral", "compound"])
    for sentence in sentences:
        sentiment = sia.polarity_scores(sentence)
        results.loc[sentence] = [
            sentiment['pos'],
            sentiment['neg'],
            sentiment['neu'],
            sentiment['compound']
        ]
    results['compound'] = (results['compound'] + 1) * 50
    results["sentiment"] = results.apply(get_sentiment, axis = 1)

    results.to_csv("data.csv")
    return results.to_dict(orient='index')