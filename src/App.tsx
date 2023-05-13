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
import { getYoutubeDetails } from "./services/youtubedetails.service";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import Barchart from "./components/visualizations/Barchart";
import Linechart from "./components/visualizations/Linechart";
import Choroplethmap from "./components/visualizations/Choroplethmap";
import YoutubeCard from "./components/YoutubeCard";
import WordCloud from "./components/visualizations/WordCloud";

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
  const [theme, setTheme] = useState("dark");
  const [analysed, setAnalysed] = useState(false);
  const [videoDetails, setVideoDetails] = useState<any>({});

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentUrl = tabs[0].url;
      setCurrentTab(currentUrl);
      if (currentUrl) {
        if (isValidYoutubeVideo(currentUrl)) {
          setValid(true);
          const videoId = getVideoId(currentUrl);
          console.log(videoId);
          if (videoId) {
            const videoDetails = await getYoutubeDetails({ videoId: videoId });
            setVideoDetails(videoDetails);
          }
        } else {
          setValid(false);
        }
      }
    });
  }, []);

  const handleClick = async () => {
    const videoId = getVideoId(currentTab!);
    if (videoId) {
      setAnalysed(true);
      setLoading(true);
      const sentimentResults = await getYoutubeSentiment({ videoId: videoId });
      setSentimentResults(sentimentResults);
      setLoading(false);
      setAvgSentiment(calculateAverage(sentimentResults));
    }
  };

  return (
    <div className={`${theme} all font-def flex flex-col`}>
      <Navbar theme={theme} setTheme={setTheme} />

      {valid && <YoutubeCard videoDetails={videoDetails} />}

      {!analysed && (
        <main className="flex justify-center flex-col items-center grow gap-5">
          {valid ? (
            <div className="dark-bs border border-dashed border-green-400 p-4 text-green-500 rounded-2xl flex gap-2 items-center">
              <CheckCircleIcon className="w-8 h-8" />
              Ready for analysis.
            </div>
          ) : (
            <div className="dark-bs border border-dashed border-red-400 p-4 text-red-500 rounded-2xl flex gap-2 items-center">
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
        </main>
      )}
      {loading && <Loader />}

      {Object.keys(sentimentResults).length > 0 && (
        <div className="flex flex-col m-5">
          <div className="flex items-center justify-center">
            <div
              className={`dark-bs border-2 border-dashed p-4 ${
                avgSentiment > 50 ? "border-green-400" : "border-red-400"
              } rounded-2xl flex gap-2 items-center text-white justify-center text-lg`}
            >
              {avgSentiment > 50 ? (
                <FaceSmileIcon className="w-5 h-5" />
              ) : (
                <FaceFrownIcon className="w-5 h-5" />
              )}
              Average Sentiment Score : {Math.round(avgSentiment)}
            </div>
          </div>
          <div>
            <Barchart data={sentimentResults} />
            <Linechart data={sentimentResults} />
            <Choroplethmap data={sentimentResults} />
            <WordCloud data={sentimentResults} />
          </div>
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
