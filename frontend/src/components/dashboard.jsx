import StatsCard from "./cards/StatsCard";
import RevenueChart from "./charts/RevenueChart";

function Dashboard({ selectedStores, selectedCategories }) {
  
  const data = [
    // ACTUAL DATA (past)
    { month: "Jan", store: "West Elm", category: "Furniture", actual: 1200 },
    { month: "Feb", store: "West Elm", category: "Furniture", actual: 1400 },
    { month: "Mar", store: "West Elm", category: "Furniture", actual: 1700 },

    // FORECAST DATA (future)
    { month: "Apr", store: "West Elm", category: "Furniture", forecast: 1800 },
    { month: "May", store: "West Elm", category: "Furniture", forecast: 2000 },
    { month: "Jun", store: "West Elm", category: "Furniture", forecast: 2200 },
  ];

  // FILTER
  const filteredData = data.filter((item) => {
    const storeMatch =
      selectedStores.length === 0 || selectedStores.includes(item.store);

    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.category);

    return storeMatch && categoryMatch;
  });

  // 🔥 GROUP BY MONTH (MERGE ACTUAL + FORECAST)
  const monthlyData = {};

  filteredData.forEach((item) => {
    if (!monthlyData[item.month]) {
      monthlyData[item.month] = {
        month: item.month,
        actual: 0,
        forecast: 0,
      };
    }

    if (item.actual) {
      monthlyData[item.month].actual += item.actual;
    }

    if (item.forecast) {
      monthlyData[item.month].forecast += item.forecast;
    }
  });

  const chartData = Object.values(monthlyData);

  // METRICS
  const totalActual = chartData.reduce(
    (sum, item) => sum + (item.actual || 0),
    0
  );

  const totalForecast = chartData.reduce(
    (sum, item) => sum + (item.forecast || 0),
    0
  );

  return (
    <div>
      {/* KPI CARDS */}
      <div className="grid grid-cols-2 gap-4">
        <StatsCard label="Actual Revenue" value={`$${totalActual}`} />
        <StatsCard label="Forecast Revenue" value={`$${totalForecast}`} />
      </div>

      {/* CHART */}
      <div className="mt-6">
        <RevenueChart data={chartData} />
      </div>
    </div>
  );
}

export default Dashboard;