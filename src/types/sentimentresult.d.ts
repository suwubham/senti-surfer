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

}
export type SentimentResults = Sentiment[];