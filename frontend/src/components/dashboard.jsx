import StatsCard from "./cards/StatsCard";
import RevenueChart from "./charts/RevenueChart";

function Dashboard({ selectedStores, selectedCategories }) {
  
  const data = [
    { store: "West Elm", category: "Furniture", revenue: 1200, month: "Jan" },
    { store: "Pottery Barn", category: "Decor", revenue: 800, month: "Jan" },
    { store: "Williams Sonoma", category: "Kitchen", revenue: 1500, month: "Jan" },

    { store: "West Elm", category: "Furniture", revenue: 1400, month: "Feb" },
    { store: "Pottery Barn", category: "Decor", revenue: 900, month: "Feb" },
    { store: "Williams Sonoma", category: "Kitchen", revenue: 1600, month: "Feb" },

    { store: "West Elm", category: "Furniture", revenue: 1700, month: "Mar" },
    { store: "Pottery Barn", category: "Decor", revenue: 950, month: "Mar" },
    { store: "Williams Sonoma", category: "Kitchen", revenue: 1800, month: "Mar" },
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

  // AGGREGATE TOTAL
  const totalRevenue = filteredData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  // 🔥 GROUP BY MONTH (IMPORTANT LOGIC)
  const revenueByMonth = {};

  filteredData.forEach((item) => {
    if (!revenueByMonth[item.month]) {
      revenueByMonth[item.month] = 0;
    }
    revenueByMonth[item.month] += item.revenue;
  });

  // Convert to array for chart
  const chartData = Object.keys(revenueByMonth).map((month) => ({
    month,
    revenue: revenueByMonth[month],
  }));

  return (
    <div>
      {/* CARDS */}
      <div className="grid grid-cols-2 gap-4">
        <StatsCard label="Revenue" value={`$${totalRevenue}`} />
        <StatsCard label="Records" value={filteredData.length} />
      </div>

      {/* CHART */}
      <div className="mt-6">
        <RevenueChart data={chartData} />
      </div>
    </div>
  );
}

export default Dashboard;