import "./App.css";
import axios from "axios";
import { useState } from "react";

function App() {
  const [comments, setComments] = useState<string[]>([]);
  const [valid, setValid] = useState<boolean>(true);

  return (
    <div className="App flex flex-col items-center justify-center gap-3">
      <h1 className="text-3xl font-bold underline">Senti-Surfer</h1>

      <button
        onClick={() => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let currentUrl = tabs[0].url;
            if (currentUrl) {
              const videoId = getVideoId(currentUrl);
              videoId ? getComments(videoId) : setValid(false);
            }
          });
        }}
      >
        Get Comments!
      </button>

      {!valid && <p className="text-red-700">Not a valid youtube video</p>}
      <ol>
        <div className="flex flex-col items-center justify-center">
          {comments.map((comment) => {
            return <li>{comment}</li>;
          })}
        </div>
      </ol>
    </div>
  );

  function getComments(videoId: string | null) {
    const params = {
      part: "snippet",
      videoId: videoId,
      maxResults: 100,
      key: import.meta.env.VITE_YTAPI_KEY,
    };

    console.log("params: ", params);
    console.log("videoId: ", videoId);

    axios
      .get("https://www.googleapis.com/youtube/v3/commentThreads", { params })
      .then((response) => {
        const comments = response.data.items.map(
          (item: any) => item.snippet.topLevelComment.snippet.textDisplay
        );
        console.log(`Retrieved ${comments.length} comments:`);
        console.log(comments);
        setComments(comments);
      })
      .catch((error) => console.error(error));
  }
}

const getVideoId = (url: string) => {
  const test_regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/)?([^\s&]{11})/;
  const isYoutubeVideo = test_regex.test(url);
  if (!isYoutubeVideo) {
    console.log("fuck you this is not a youtube video 😕");
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
