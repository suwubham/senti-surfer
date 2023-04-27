interface Sentiment {
  text: string;
  author: string;
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  compound: number;
  sentiment: string;
}
export type SentimentResults = Sentiment[];