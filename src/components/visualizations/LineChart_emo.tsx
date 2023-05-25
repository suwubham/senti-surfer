import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { SentimentResults } from "../../types/sentimentresult";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

interface AverageScores {
  anger: number;
  disgust: number;
  joy: number;
  count: number;
}

interface AverageScoresByDate {
  [date: string]: AverageScores;
}

export default function MultiLine({ data }: { data: SentimentResults }) {
  var labels = data.map((item) => item.date);
  labels = [...new Set(labels)]; // remove duplicates
  labels.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()); // sort labels in ascending order

  const datas = {
    labels,
    datasets: [
      {
        label: "Anger",
        data: labels.map((date) => {
          const items = data.filter((item) => item.date === date);
          const count = items.length;
          const total = items.reduce((acc, item) => acc + item.anger, 0);
          return count > 0 ? total / count : 0;
        }),
        borderColor: "rgba(255,20,147,0.8)",
        backgroundColor: "rgba(255,20,147,0.8)",
      },
      {
        label: "Disgust",
        data: labels.map((date) => {
          const items = data.filter((item) => item.date === date);
          const count = items.length;
          const total = items.reduce((acc, item) => acc + item.disgust, 0);
          return count > 0 ? total / count : 0;
        }),
        borderColor: "rgba(34,139,34,0.8)",
        backgroundColor: "rgba(34,139,34,0.8)",
      },
      {
        label: "Joy",
        data: labels.map((date) => {
          const items = data.filter((item) => item.date === date);
          const count = items.length;
          const total = items.reduce((acc, item) => acc + item.joy, 0);
          return count > 0 ? total / count : 0;
        }),
        borderColor: "rgba(67, 133, 213, 0.8)",
        backgroundColor: "rgba(67, 133, 213, 0.8)",
      },
    ],
  };

  return <Line options={options} data={datas} />;
}
