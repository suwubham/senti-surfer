import axios from "axios";

export const getComments = async (videoId: string | null) => {
  const params = {
    part: "snippet",
    videoId: videoId,
    maxResults: 100,
    key: import.meta.env.VITE_YTAPI_KEY,
  };

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/commentThreads",
      { params }
    );
    const comments = response.data.items.map(
      (item: any) => item.snippet.topLevelComment.snippet.textDisplay
    );
    console.log(`Retrieved ${comments.length} comments:`);
    return comments;
  } catch (error) {
    console.error(error);
    return [];
  }
};