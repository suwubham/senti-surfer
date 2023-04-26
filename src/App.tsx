import "./App.css";
import { useState, useEffect } from "react";
import { SentimentResults } from "./types/sentimentresult";
import {
  ChartBarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { getYoutubeSentiment } from "./services/youtubeanalysis.service";
// import Barchart from "./components/BarChart";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";

function isValidYoutubeVideo(url: string) {
  const youtubeUrlPattern =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/)?([a-zA-Z0-9_-]{11})/;
  return youtubeUrlPattern.test(url);
}

function App() {
  const [valid, setValid] = useState<boolean>(true);
  const [sentimentResults, setSentimentResults] = useState<SentimentResults>(
    {}
  );
  const [currentTab, setCurrentTab] = useState<string | undefined>("");
  const [loading, setLoading] = useState<Boolean>(false);

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
    }
  };

  return (
    <div className="all font-def">
      <Navbar />
      <main className="h-96 flex items-center justify-center flex-col gap-5">
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

        {/* {Object.keys(sentimentResults).length > 0 && (
          <Barchart test={sentimentResults} />
        )} */}
      </main>
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
