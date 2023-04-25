import "./App.css";
import { useState, useEffect } from "react";
import { SentimentResults } from "./types/sentimentresult";
import { getSentimentResults } from "./services/getsentiment.service";
import { getComments } from "./services/getcomments.service";
import BarChart from "./components/BarChart";
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
    <div className="App">
      {valid ? (
        <p className="text-red-500">Valid Shit</p>
      ) : (
        <p className="text-green-500">Invalid Shit</p>
      )}
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
