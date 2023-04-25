import "./App.css";
import { useState, useEffect } from "react";
import { SentimentResults } from "./types/sentimentresult";
import {
  ArrowDownOnSquareIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { getYoutubeSentiment } from "./services/youtubeanalysis.service";

function isValidYoutubeVideo(url: string) {
  const youtubeUrlPattern =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/)?([a-zA-Z0-9_-]{11})/;
  return youtubeUrlPattern.test(url);
}

function App() {
  const [valid, setValid] = useState<boolean>(false);
  const [sentimentResults, setSentimentResults] = useState<SentimentResults>(
    {}
  );
  const [currentTab, setCurrentTab] = useState<string | undefined>("");

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
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentUrl = tabs[0].url;
      if (currentUrl) {
        const videoId = getVideoId(currentUrl);
        if (videoId) {
          const data = await getYoutubeSentiment({ videoId: videoId });
          setSentimentResults(data);
        } else {
          setValid(false);
        }
      }
    });
  };

  return (
    <div className="all font-def">
      <nav className="nav w-full px-3 flex items-center justify-between text-gray-300 h-16">
        <div className="title flex gap-2 items-center font-black text-lg">
          <div className="logo w-7 h-7"></div>
          <div>Senti-Surfer</div>
        </div>
        <div className="extras flex gap-3 items-center">
          <label className="switch">
            <input type="checkbox"></input>
            <span className="slider"></span>
          </label>
          <ArrowDownOnSquareIcon className="w-7 h-7 hover:cursor-pointer" />
        </div>
      </nav>
      <main className="h-96 flex items-center justify-center flex-col gap-3">
        {valid ? (
          <div className="test border border-dashed border-green-400 p-4 text-green-500 rounded-2xl flex gap-2 items-center">
            <CheckCircleIcon className="w-8 h-8" />
            Ready for analysis.
          </div>
        ) : (
          <div className="test border border-dashed border-red-400 p-4 text-red-500 rounded-2xl flex gap-2 items-center">
            <ExclamationCircleIcon className="w-8 h-8" />
            No cotent available for analysis.
          </div>
        )}

        <button className="flex items-center justify-center gap-2">
          Analyse
          <ChartBarIcon className="w-5 h-5" />
        </button>
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
