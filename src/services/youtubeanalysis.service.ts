import axios from "axios";

export async function getYoutubeSentiment(videoId : {"videoId": string}) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/analyze-youtube-comments",
      videoId
    );
    const results = response.data;
    return results;
  } catch (error) {
    console.error(error);
  }
}