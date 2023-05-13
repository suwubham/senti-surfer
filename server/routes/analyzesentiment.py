from fastapi import APIRouter
import requests
from dotenv import load_dotenv
import os
import pycountry
from nltk.sentiment import SentimentIntensityAnalyzer
from config.db import db
import datetime
sia = SentimentIntensityAnalyzer()



load_dotenv() 
route_analyzeytsentiment = APIRouter()

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
    try:
        if response.status_code == 200:
            location = response.json()["items"][0]["snippet"]["country"]
            iso3 = pycountry.countries.get(alpha_2=location).alpha_3
            return iso3
        else:
            return "Null"
    except:
        return "Null"

def days_between(d1,d2):
    d1 = datetime.datetime.strptime(d1, "%Y-%m-%d")
    d2 = datetime.datetime.strptime(d2, "%Y-%m-%d")
    return abs((d2 - d1).days)
    
@route_analyzeytsentiment.post("/analyze-youtube-comments")
def get_comments(videoId : dict):
    previous_data = db["comments"].find_one({"videoId":videoId["videoId"]})
    if previous_data is not None:
        if days_between(previous_data["analysed_date"], datetime.date.today().strftime("%Y-%m-%d")) < 3:
            return previous_data["data"]
        else:
            db["comments"].delete_one({"videoId":videoId["videoId"]})
        
    comments = get_youtube_comments(videoId["videoId"])
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
            'location':get_channel_location(comment['channelId']),
            
        }
        results.append(result)
    formatted_data = {"videoId" : videoId["videoId"], "data" : results, "analysed_date" : datetime.date.today().strftime("%Y-%m-%d")}
    db["comments"].insert_one(formatted_data)
    return results