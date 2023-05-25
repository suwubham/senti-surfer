from fastapi import APIRouter
import requests
from dotenv import load_dotenv
import os
import pycountry
import re
from config.db import db
import datetime
from transformers import pipeline
from ai4bharat.transliteration import XlitEngine
from googletrans import Translator

emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", return_all_scores=True)
sentiment_analyzer = pipeline('sentiment-analysis', model="cardiffnlp/twitter-roberta-base-sentiment", return_all_scores=True)
e = XlitEngine(["ne"], beam_width=10, src_script_type = "en")
translator = Translator()

with open('words.txt', 'r') as f:
    words = f.read().lower().split()

def is_nwep(text):
    text = text.lower().split()
    english_words = set(words).intersection(text)
    return len(english_words)/len(text) < 0.8

def is_nepali(text):
    nepali_pattern = re.compile(r'[\u0900-\u097F]+')  # Range of Unicode characters for Nepali script
    if nepali_pattern.search(text):
        return True
    else:
        return False
    
load_dotenv() 
route_analyzeytsentiment = APIRouter()
route_analyzesingle = APIRouter()

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

@route_analyzesingle.post("/analyze-single")
def analyze(text : dict):
    text = text["text"]
    if is_nepali(text):
        translated_text = translator.translate(text)
        print(translated_text.text)
        text = translated_text.text

    elif is_nwep(text):
        transliterate_text = e.translit_sentence(text)
        translated_text = translator.translate(transliterate_text["ne"])
        print(translated_text.text)
        text = translated_text.text
    
    data = emotion_classifier(text)[0]
    senti = sentiment_analyzer(text)[0]
    senti_scores = {}
    senti_scores["positive"] = [label['score'] for label in senti if label['label'] == 'LABEL_2'][0]
    senti_scores["neutral"] = [label['score'] for label in senti if label['label'] == 'LABEL_1'][0]
    senti_scores["negative"] = [label['score'] for label in senti if label['label'] == 'LABEL_0'][0]
    senti_scores["compound"] = (senti_scores["positive"] - senti_scores["negative"]) / (senti_scores["positive"] + senti_scores["negative"] + senti_scores["neutral"])

    result = {
        'positive': senti_scores["positive"],
        'negative': senti_scores["negative"],
        'neutral': senti_scores["neutral"],
        'compound': (senti_scores["compound"] + 1) * 50,
        'sentiment': max(senti_scores, key=senti_scores.get),
        'anger' : data[0]["score"],
        'disgust' : data[1]["score"],
        'fear' : data[2]["score"],
        'joy' : data[3]["score"],
        'neutral_emotion' : data[4]["score"],
        'sadness' : data[5]["score"],
        'surprise' : data[6]["score"],
    }
    
    return result


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
        text = comment['textDisplay'][:500]
        print(text)

        data = emotion_classifier(text)[0]
        senti = sentiment_analyzer(text)[0]
        
        senti_scores = {}
        senti_scores["positive"] = [label['score'] for label in senti if label['label'] == 'LABEL_2'][0]
        senti_scores["neutral"] = [label['score'] for label in senti if label['label'] == 'LABEL_1'][0]
        senti_scores["negative"] = [label['score'] for label in senti if label['label'] == 'LABEL_0'][0]
        senti_scores["compound"] = (senti_scores["positive"] - senti_scores["negative"]) / (senti_scores["positive"] + senti_scores["negative"] + senti_scores["neutral"])

        result = {
            'text': comment['textDisplay'],
            'author': comment['author'],
            'date': comment['date'][:10],
            'positive': senti_scores["positive"],
            'negative': senti_scores["negative"],
            'neutral': senti_scores["neutral"],
            'compound': (senti_scores["compound"] + 1) * 50,
            'sentiment': max(senti_scores, key=senti_scores.get),
            'channelId':comment['channelId'],
            'anger' : data[0]["score"],
            'disgust' : data[1]["score"],
            'fear' : data[2]["score"],
            'joy' : data[3]["score"],
            'neutral_emotion' : data[4]["score"],
            'sadness' : data[5]["score"],
            'surprise' : data[6]["score"],
            'location':get_channel_location(comment['channelId']),
        }
        results.append(result)
    formatted_data = {"videoId" : videoId["videoId"], "data" : results, "analysed_date" : datetime.date.today().strftime("%Y-%m-%d")}
    db["comments"].insert_one(formatted_data)
    return results