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
}
export type SentimentResults = Sentiment[];