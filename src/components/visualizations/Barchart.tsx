import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { SentimentResults } from "../../types/sentimentresult";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

const labels = ["Positive", "Negative", "Neutral"];

export default function Chart({ data }: { data: SentimentResults }) {
  const formatted_data = format_data(data);
  return <Bar options={options} data={formatted_data} />;
}

function format_data(data: SentimentResults) {
  const positive = data.filter(
    (comment) => comment["sentiment"] === "positive"
  ).length;
  const negative = data.filter(
    (comment) => comment["sentiment"] === "negative"
  ).length;
  const neutral = data.filter(
    (comment) => comment["sentiment"] === "neutral"
  ).length;

  const formatted_data = {
    labels,
    datasets: [
      {
        label: "Sentiment Scores",
        data: [positive, negative, neutral],
        backgroundColor: "#fbca1f",
      },
    ],
  };

  return formatted_data;
}
