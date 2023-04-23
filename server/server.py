from typing import List
from fastapi import FastAPI
from nltk.sentiment import SentimentIntensityAnalyzer
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd

app = FastAPI()

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