import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

function YoutubeCard({ videoDetails }: any) {
  return (
    <div className="p-3">
      <div className="text-gray-400 rounded-lg shadow-md p-4 card">
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
    </div>
  );
}

export default YoutubeCard;
