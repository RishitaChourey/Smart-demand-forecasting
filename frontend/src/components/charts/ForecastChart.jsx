import { Line } from "react-chartjs-2";
import { MONTHS, ACTUAL_REV, FORECAST_REV } from "../../data/mockData";

const ForecastChart = () => {
  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: "Forecast",
        data: FORECAST_REV,
      },
      {
        label: "Actual",
        data: ACTUAL_REV,
      },
    ],
  };

  return <Line data={data} />;
};

export default ForecastChart;