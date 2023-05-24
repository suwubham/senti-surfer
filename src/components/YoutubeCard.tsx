import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
  EyeIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  FaceSmileIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";

function YoutubeCard({ videoDetails, analysed, valid, handleClick }: any) {
  return (
    <div className="p-3">
      <div className=" rounded-lg shadow-md p-4 card">
        <div className="flex flex-col text-gray-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <img
                src={videoDetails.photo_url}
                alt="Video thumbnail"
                className="h-12 object-cover rounded-lg"
              ></img>
            </div>
            <div className="ml-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold">{videoDetails.title}</h2>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-1 justify-between">
            <span className="text-sm mr-2 flex gap-1">
              <EyeIcon className="w-5 h-5" /> Views:{" "}
              {Number(videoDetails.view_count).toLocaleString("en-US")}
            </span>
            <span className="text-sm mr-2 flex gap-1">
              <HandThumbUpIcon className="w-5 h-5" /> Likes:{" "}
              {Number(videoDetails.likes_count).toLocaleString("en-US")}
            </span>
            <span className="text-sm flex gap-1">
              <ChatBubbleBottomCenterIcon className="w-5 h-5" /> Comments:{" "}
              {Number(videoDetails.comments_count).toLocaleString("en-US")}
            </span>
          </div>
        </div>

        {!analysed && (
          <main className="flex justify-center flex-col items-center grow gap-5 mt-6">
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
      </div>
    </div>
  );
}

export default YoutubeCard;
