import axios from "axios";

export async function getSentimentResults(sentences: string[]) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/analyze-sentiment",
      sentences
    );
    const results = response.data;
    return results;
  } catch (error) {
    console.error(error);
  }
}