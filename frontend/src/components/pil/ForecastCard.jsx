import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function ForecastChart({ simState }) {
  const base = [2000, 2200, 2100, 1900, 2300];

  const dataPoints = base.map(
    (d) =>
      Math.round(
        d *
          simState.weatherImpact *
          (1 + simState.discount * 0.02)
      )
  );

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Forecast",
        data: dataPoints,
      },
    ],
  };

  return <Line data={data} />;
}