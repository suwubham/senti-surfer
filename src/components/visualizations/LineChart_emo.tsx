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

var labels = [
  "2022-02-11",
  "2022-03-04",
  "2022-05-12",
  "2022-06-17",
  "2022-07-23",
  "2022-08-07",
  "2022-09-09",
  "2022-10-15",
  "2022-11-28",
  "2022-12-05",
  "2023-01-02",
  "2023-02-18",
  "2023-03-29",
  "2023-04-10",
  "2023-05-03",
  "2023-06-16",
  "2023-07-30",
  "2023-08-23",
  "2023-09-21",
  "2023-12-26",
];

export const datas = {
  labels,
  datasets: [
    {
      label: "Anger",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
      borderColor: "rgba(255,20,147,0.8)",
      backgroundColor: "rgba(255,20,147,0.8)",
    },
    {
      label: "Disgust",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
      borderColor: "rgba(34,139,34,0.8)",
      backgroundColor: "rgba(34,139,34,0.8)",
    },
    {
      label: "Joy",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
      borderColor: "rgba(67, 133, 213, 0.8)",
      backgroundColor: "rgba(67, 133, 213, 0.8)",
    },
  ],
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
