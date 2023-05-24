import { useState } from "react";
import { getSingleSentiment } from "../services/analyzetext.service";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const baroptions = {
  indexAxis: "y" as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
    },
    title: {
      display: true,
      text: "Results",
    },
  },
};

const radaroptions = {
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    r: {
      angleLines: {
        lineWidth: 2,
        color: "rgba(0,0,0, 0.3)",
      },
      ticks: {
        display: false,
      },
    },
  },
};

const labels = ["Positive", "Negative", "Neutral"];

function TryItOut() {
  const [text, setText] = useState("");
  const [analysed, setAnalysed] = useState(false);
  const [bardata, setBarData] = useState<any>();
  const [radardata, setRadarData] = useState<any>();

  const handleClick = async () => {
    const sentimentResults = await getSingleSentiment({ text: text });
    console.log(sentimentResults);
    const bardata = {
      labels,
      datasets: [
        {
          label: "Score",
          data: [
            sentimentResults.positive,
            sentimentResults.negative,
            sentimentResults.neutral,
          ],
          borderColor: "rgb(246, 201, 0)",
          backgroundColor: "rgba(246, 201, 0, 0.5)",
        },
      ],
    };

    const radardata = {
      labels: [
        "Anger",
        "Disgust",
        "Fear",
        "Joy",
        "Sadness",
        "Surprise",
        "Neutral",
      ],
      datasets: [
        {
          label: "Score",
          data: [
            sentimentResults.anger * 100,
            sentimentResults.disgust * 100,
            sentimentResults.fear * 100,
            sentimentResults.joy * 100,
            sentimentResults.sadness * 100,
            sentimentResults.surprise * 100,
            sentimentResults.neutral_emotion * 100,
          ],
          backgroundColor: "rgba(243, 201, 51, 0.2)",
          borderColor: "rgba(243, 201, 51)",
          borderWidth: 1,
        },
      ],
    };

    setAnalysed(true);
    setBarData(bardata);
    setRadarData(radardata);
  };

  return (
    <div className="p-5 card m-5 flex flex-col gap-3">
      <h1 className="font-bold text-gray-300 text-xl">Try it out!</h1>
      <input
        type="text"
        className="p-2 rounded-[7px] bg-slate-800 w-80 text-gray-400 border-yellow-400 border focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        placeholder="Enter sample text here..."
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="flex items-center justify-center gap-2 ml-auto"
        onClick={handleClick}
      >
        Analyze
      </button>

      {analysed && (
        <div className="text-red-900">
          <Bar options={baroptions} data={bardata} />
          <Radar data={radardata} options={radaroptions} />
        </div>
      )}
    </div>
  );
}

export default TryItOut;
