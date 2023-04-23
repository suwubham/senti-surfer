import "./App.css";
import { useState } from "react";
import { SentimentResults } from "./types/sentimentresult";
import { getSentimentResults } from "./services/getsentiment.service";
import { getComments } from "./services/getcomments.service";
import BarChart from "./components/BarChart";

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
            <>
              <p>
                Average Sentiment Score : {calculateAverage(sentimentResults)}
              </p>
              <div className="w-96 h-96 bg-slate-400 flex items-center justify-center">
                <BarChart test={sentimentResults} />
              </div>
            </>
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

const calculateAverage = (sentimentResults: SentimentResults) => {
  const total_compund = Object.keys(sentimentResults).reduce(
    (acc, key) => acc + sentimentResults[key].compound,
    0
  );
  return total_compund / Object.keys(sentimentResults).length;
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
    return match[1];
  }
  return null;
};

export default App;
