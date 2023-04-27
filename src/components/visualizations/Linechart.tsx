import React from "react";
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
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

interface ScoresByMonth {
  [date: string]: number[];
}

interface averageScores {
  [date: string]: number;
}

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const dataa = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

export default function LineChart({ data }: { data: SentimentResults }) {
  const formattedData = formatData(data);
  console.log(formattedData);
  return <Line options={options} data={formattedData} />;
}

function averageMonthlyScores(data: SentimentResults) {
  const scoresByMonth: ScoresByMonth = {};
  data.map((comment) => {
    const date = comment.date.substring(0, 10);
    if (date in scoresByMonth) {
      scoresByMonth[date].push(comment.compound);
    } else {
      scoresByMonth[date] = [comment.compound];
    }
  });

  const averageScores: averageScores = {};
  for (const [date, scores] of Object.entries(scoresByMonth)) {
    averageScores[date] = scores.reduce((a, b) => a + b) / scores.length;
  }
  return averageScores;
}

function formatData(data: SentimentResults) {
  const averageScores = averageMonthlyScores(data);
  console.log(averageScores);
  const labels = Object.keys(averageScores);
  const scores = Object.values(averageScores);
  return {
    labels,
    datasets: [
      {
        label: "Sentiment Scores",
        data: scores,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
}
