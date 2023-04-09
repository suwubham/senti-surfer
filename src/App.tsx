import "./App.css";
import axios from "axios";
import { useState } from "react";
import { SentimentResults } from "./types/sentimentresult";

function App() {
  const [comments, setComments] = useState<string[]>([]);
  const [valid, setValid] = useState<boolean>(true);

  const [sentimentResults, setSentimentResults] = useState<SentimentResults>(
    {}
  );

  const handleClick = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentUrl = tabs[0].url;
      if (currentUrl) {
        const videoId = getVideoId(currentUrl);
        if (videoId) {
          const comments = await getComments(videoId);
          setComments(comments);
          const results = await getSentimentResults(comments);
          setSentimentResults(results);
        } else {
          setValid(false);
        }
      }
    });
  };

  return (
    <div className="App flex flex-col items-center justify-center gap-3">
      <h1 className="text-3xl font-bold underline">Senti-Surfer</h1>
      <button onClick={handleClick}>Analyze</button>

      <div className="mt-4 flex flex-col gap-2">
        <p className="font-bold">
          {Object.keys(sentimentResults).length != 0 ? (
            <p>
              Average Sentiment Score : {calculateAverage(sentimentResults)}
            </p>
          ) : null}
        </p>
        {Object.keys(sentimentResults).map((result) => (
          <div key={result} className="p-4 bg-gray-900 rounded-lg">
            <h2 className="text-lg font-bold">{result}</h2>
            <p className="mt-2">Score: {sentimentResults[result].compound}</p>
          </div>
        ))}
      </div>

      {!valid && <p className="text-red-700">Not a valid youtube video</p>}
    </div>
  );
}

async function getSentimentResults(sentences: string[]) {
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

const calculateAverage = (sentimentResults: SentimentResults) => {
  const total_compund = Object.keys(sentimentResults).reduce(
    (acc, key) => acc + sentimentResults[key].compound,
    0
  );
  return total_compund / Object.keys(sentimentResults).length;
};

const getComments = async (videoId: string | null) => {
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

const getVideoId = (url: string) => {
  const test_regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/)?([^\s&]{11})/;
  const isYoutubeVideo = test_regex.test(url);

  if (!isYoutubeVideo) {
    return null;
  }

  const regex = /v=([^\&]+)/;
  const match = url.match(regex);

  if (match) {
    console.log(match);
    return match[1];
  }
  return null;
};

export default App;
