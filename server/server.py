from typing import List
from fastapi import FastAPI
from nltk.sentiment import SentimentIntensityAnalyzer
import pandas as pd
app = FastAPI()

@app.post("/analyze-sentiment")
def analyze_sentiment(sentences: List[str]):
    sia = SentimentIntensityAnalyzer()
    results = {}
    for sentence in sentences:
        sentiment = sia.polarity_scores(sentence)
        results[sentence] = {
            "positive": sentiment['pos'],
            "negative": sentiment['neg'],
            "neutral": sentiment['neu'],
            "compound": sentiment['compound']
        }
        print(results)
    df = pd.DataFrame(results).T
    df.reset_index()
    df.to_csv("data.csv")
    return results