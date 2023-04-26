import "./App.css";
import { useState, useEffect } from "react";
import { SentimentResults } from "./types/sentimentresult";
import {
  ChartBarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  FaceSmileIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";
import { getYoutubeSentiment } from "./services/youtubeanalysis.service";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import Barchart from "./components/visualizations/Barchart";
import Linechart from "./components/visualizations/Linechart";

function isValidYoutubeVideo(url: string) {
  const youtubeUrlPattern =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/)?([a-zA-Z0-9_-]{11})/;
  return youtubeUrlPattern.test(url);
}

function App() {
  const [valid, setValid] = useState<boolean>(true);
  const [sentimentResults, setSentimentResults] = useState<SentimentResults>(
    []
  );
  const [currentTab, setCurrentTab] = useState<string | undefined>("");
  const [loading, setLoading] = useState<Boolean>(false);
  const [avgSentiment, setAvgSentiment] = useState(0);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentUrl = tabs[0].url;
      setCurrentTab(currentUrl);
      if (currentUrl) {
        isValidYoutubeVideo(currentUrl) ? setValid(true) : setValid(false);
      }
    });
  }, []);

  const handleClick = async () => {
    const videoId = getVideoId(currentTab!);
    console.log(videoId);
    if (videoId) {
      setLoading(true);
      const sentimentResults = await getYoutubeSentiment({ videoId: videoId });
      setSentimentResults(sentimentResults);
      setLoading(false);
      setAvgSentiment(calculateAverage(sentimentResults));
    }
  };

  return (
    <div className="all font-def">
      <Navbar />

      <main className="flex items-center justify-center flex-col gap-5 py-5">
        {valid ? (
          <div className="test border border-dashed border-green-400 p-4 text-green-500 rounded-2xl flex gap-2 items-center">
            <CheckCircleIcon className="w-8 h-8" />
            Ready for analysis.
          </div>
        ) : (
          <div className="test border border-dashed border-red-400 p-4 text-red-500 rounded-2xl flex gap-2 items-center">
            <ExclamationCircleIcon className="w-8 h-8" />
            No content available for analysis.
          </div>
        )}

        {valid && (
          <button
            className="flex items-center justify-center gap-2"
            onClick={handleClick}
          >
            Analyse
            <ChartBarIcon className="w-5 h-5" />
          </button>
        )}

        {loading && <Loader />}
      </main>
      {Object.keys(sentimentResults).length > 0 && (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="test border border-dashed border-yellow-400 text-white p-4 rounded-2xl flex gap-2 items-center">
            {avgSentiment > 50 ? (
              <FaceSmileIcon className="w-5 h-5" />
            ) : (
              <FaceFrownIcon className="w-5 h-5" />
            )}
            Average Sentiment Score : {Math.round(avgSentiment)}
          </div>
          <Barchart data={sentimentResults} />
          <Linechart data={sentimentResults} />
        </div>
      )}
    </div>
  );
}

const calculateAverage = (sentimentResults: SentimentResults) => {
  let total_compound = 0;
  sentimentResults.map((result) => (total_compound += result.compound));
  return total_compound / sentimentResults.length;
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
