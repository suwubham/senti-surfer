interface Sentiment {
  text: string;
  author: string;
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  compound: number;
  sentiment: string;
  location: string;
  country: string;
  anger: number;
  disgust: number;
  fear: number;
  joy: number;
  sadness: number;
  surprise: number;
  neutral_emotion: number;
}

interface Sentiment {
  positive: number;
  negative: number;
  neutral: number;
  compound: number;
  sentiment: string;
  anger: number;
  disgust: number;
  fear: number;
  joy: number;
  sadness: number;
  surprise: number;
  neutral_emotion: number;
}

export type Sentiment = Sentiment;

export type SentimentResults = Sentiment[];