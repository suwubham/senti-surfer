import { SentimentResults } from "../../types/sentimentresult";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const data = {
  labels: ["Thing 1", "Thing 2", "Thing 3", "Thing 4", "Thing 5", "Thing 6"],
  datasets: [
    {
      label: "# of Votes",
      data: [5, 9, 3, 5, 6, 4],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

export default function App({ data }: { data: SentimentResults }) {
  const options = {
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

  const averageScores = calculateAverageScores(data);
  const um = {
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
        label: "Percentage",
        data: [

          averageScores.anger * 100,
          averageScores.disgust * 100,
          averageScores.fear * 100,
          averageScores.joy * 100,
          averageScores.sadness * 100,
          averageScores.surprise * 100,
          averageScores.neutral_emotion * 100,

        ],
        backgroundColor: "rgba(243, 201, 51, 0.2)",
        borderColor: "rgba(243, 201, 51)",
        borderWidth: 1,
      },
    ],
  };

  return <Radar data={um} options={options} />;
}

function calculateAverageScores(data: any) {
  let totalAnger = 0;
  let totalDisgust = 0;
  let totalFear = 0;
  let totalJoy = 0;
  let totalSadness = 0;
  let totalSurprise = 0;
  let totalNeutral = 0;

  for (let i = 0; i < data.length; i++) {
    totalAnger += data[i].anger;
    totalDisgust += data[i].disgust;
    totalFear += data[i].fear;
    totalJoy += data[i].joy;
    totalSadness += data[i].sadness;
    totalSurprise += data[i].surprise;
    totalNeutral += data[i].neutral_emotion;
  }

  const averageAnger = totalAnger / data.length;
  const averageDisgust = totalDisgust / data.length;
  const averageFear = totalFear / data.length;
  const averageJoy = totalJoy / data.length;
  const averageSadness = totalSadness / data.length;
  const averageSurprise = totalSurprise / data.length;
  const averageNeutral = totalNeutral / data.length;

  const averageScores = {
    anger: averageAnger,
    disgust: averageDisgust,
    fear: averageFear,
    joy: averageJoy,
    sadness: averageSadness,
    surprise: averageSurprise,
    neutral_emotion: averageNeutral,
  };

  return averageScores;
}
