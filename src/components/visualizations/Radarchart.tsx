import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { SentimentResults } from "../../types/sentimentresult";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }: { data: SentimentResults }) {
  const averageScores = calculateAverageScores(data);
  const um = {
    labels: ["Anger", "Disgust", "Fear", "Joy", "Sadness", "Surprise"],
    datasets: [
      {
        label: "# of Votes",
        data: [
          averageScores.anger,
          averageScores.disgust,
          averageScores.fear,
          averageScores.joy,
          averageScores.sadness,
          averageScores.surprise,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return <Pie data={um} />;
}

function calculateAverageScores(data: any) {
  let totalAnger = 0;
  let totalDisgust = 0;
  let totalFear = 0;
  let totalJoy = 0;
  let totalSadness = 0;
  let totalSurprise = 0;

  for (let i = 0; i < data.length; i++) {
    totalAnger += data[i].anger;
    totalDisgust += data[i].disgust;
    totalFear += data[i].fear;
    totalJoy += data[i].joy;
    totalSadness += data[i].sadness;
    totalSurprise += data[i].surprise;
  }

  const averageAnger = totalAnger / data.length;
  const averageDisgust = totalDisgust / data.length;
  const averageFear = totalFear / data.length;
  const averageJoy = totalJoy / data.length;
  const averageSadness = totalSadness / data.length;
  const averageSurprise = totalSurprise / data.length;

  const averageScores = {
    anger: averageAnger,
    disgust: averageDisgust,
    fear: averageFear,
    joy: averageJoy,
    sadness: averageSadness,
    surprise: averageSurprise,
  };

  return averageScores;
}
