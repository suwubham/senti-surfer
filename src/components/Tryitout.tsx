import {
  ChartBarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  FaceSmileIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";

function TryItOut() {
  return (
    <div className="p-5 card">
      <h1 className="font-bold">Try it out!</h1>
      <div className="flex flex-col items-center justify-center gap-2">
        <input
          type="text"
          className="p-2 rounded-lg bg-slate-800 w-96 text-gray-400"
          placeholder="Enter sample text here..."
        />

        <button className="flex items-center justify-center gap-2">
          Analyse
          <ChartBarIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default TryItOut;
