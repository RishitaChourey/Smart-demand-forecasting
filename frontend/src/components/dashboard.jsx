import StatsCard from "./cards/StatsCard";

function Dashboard({ selectedStores, selectedCategories }) {
  
  // Dummy dataset (acts like backend)
  const data = [
    { store: "West Elm", category: "Furniture", revenue: 1200 },
    { store: "Pottery Barn", category: "Decor", revenue: 800 },
    { store: "Williams Sonoma", category: "Kitchen", revenue: 1500 },
    { store: "PB Teen", category: "Outdoor", revenue: 600 },
  ];

  // 🔥 FILTER LOGIC
  const filteredData = data.filter((item) => {
    const storeMatch =
      selectedStores.length === 0 || selectedStores.includes(item.store);

    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.category);

    return storeMatch && categoryMatch;
  });

  // Aggregate result
  const totalRevenue = filteredData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <StatsCard label="Revenue" value={`$${totalRevenue}`} />
        <StatsCard label="Records" value={filteredData.length} />
      </div>

      <div className="mt-6 text-sm text-gray-600">
        Active Filters:
        <div>Stores: {selectedStores.join(", ") || "All"}</div>
        <div>Categories: {selectedCategories.join(", ") || "All"}</div>
      </div>
    </div>
  );
}

export default Dashboard;