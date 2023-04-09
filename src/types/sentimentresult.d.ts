interface Sentiment {
  positive: number;
  negative: number;
  neutral: number;
  compound: number;
}

export interface SentimentResults {
  [key: string]: Sentiment;
}