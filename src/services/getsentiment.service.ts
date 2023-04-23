import axios from "axios";

export async function getSentimentResults(sentences: string[]) {
  console.log(sentences);
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/analyze-sentiment",
      sentences
    );
    const results = response.data;
    console.log(results);
    return results;
  } catch (error) {
    console.error(error);
  }
}