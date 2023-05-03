import React from "react";

function YoutubeCard({ videoDetails }: any) {
  return (
    <div className="p-3">
      <div className="bg-white rounded-lg shadow-md p-4 flex">
        <div className="flex-shrink-0">
          <img
            src={videoDetails.photo_url}
            alt="Video thumbnail"
            className="h-12 object-cover rounded-lg"
          ></img>
        </div>
        <div className="ml-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {videoDetails.title}
            </h2>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-700 mr-2">
                <i className="fas fa-eye"></i> Views: {videoDetails.view_count}
              </span>
              <span className="text-sm text-gray-700 mr-2">
                <i className="fas fa-thumbs-up"></i> Likes:{" "}
                {videoDetails.likes_count}
              </span>
              <span className="text-sm text-gray-700">
                <i className="fas fa-comment"></i> Comments:{" "}
                {videoDetails.comments_count}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YoutubeCard;
