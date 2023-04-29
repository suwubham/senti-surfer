import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col grow items-center justify-center ">
      <div className="loader">
        <span className="loader-text">Analyzing</span>
        <span className="load"></span>
      </div>
    </div>
  );
}
