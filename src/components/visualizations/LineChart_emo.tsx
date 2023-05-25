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
        data: labels.map(
          (date) => data.find((item) => item.date === date)?.anger || 0
        ),
        borderColor: "rgba(255,20,147,0.8)",
        backgroundColor: "rgba(255,20,147,0.8)",
      },
      {
        label: "Disgust",
        data: labels.map(
          (date) => data.find((item) => item.date === date)?.disgust || 0
        ),
        borderColor: "rgba(34,139,34,0.8)",
        backgroundColor: "rgba(34,139,34,0.8)",
      },
      {
        label: "Joy",
        data: labels.map(
          (date) => data.find((item) => item.date === date)?.joy || 0
        ),
        borderColor: "rgba(67, 133, 213, 0.8)",
        backgroundColor: "rgba(67, 133, 213, 0.8)",
      },
    ],
  };

  calculateAverageScores(data);
  return <Line options={options} data={datas} />;
}

function calculateAverageScores(data: SentimentResults) {
  const scoresByDate: AverageScoresByDate = {};
  data.forEach((item) => {
    const { date, anger, disgust, joy } = item;
    if (!scoresByDate[date]) {
      scoresByDate[date] = {
        anger: 0,
        disgust: 0,
        joy: 0,
        count: 0,
      };
    }
    scoresByDate[date].anger += anger || 0;
    scoresByDate[date].disgust += disgust || 0;
    scoresByDate[date].joy += joy || 0;
    scoresByDate[date].count += 1;
  });

  const averageScores: any = {};
  for (const date in scoresByDate) {
    const { anger, disgust, joy, count } = scoresByDate[date];
    averageScores[date] = {
      anger: anger / count || 0,
      disgust: disgust / count || 0,
      joy: joy / count || 0,
    };
  }

  console.log(averageScores);

  return;
}
