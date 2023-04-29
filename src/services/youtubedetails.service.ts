import axios from "axios";

export async function getYoutubeDetails(videoId : {"videoId": string}) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/get-youtube-details",
      videoId
    );
    const results = response.data;
    return results;
  } catch (error) {
    console.error(error);
  }
}