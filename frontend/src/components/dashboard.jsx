import { useState } from "react";
import StatsCard from "./cards/StatsCard";
import RevenueChart from "./charts/RevenueChart";
import InsightsPanel from "./InsightsPanel";
import MonthlyTrendChart from "./charts/MonthlyTrendChart";
import StoreShareChart from "./charts/StoreShareChart";

function Dashboard({ selectedStores, selectedCategories }) {

  const [selectedLocation, setSelectedLocation] = useState(null);

  const data = [
    { month: "Jan", store: "West Elm", location: "California", category: "Furniture", actual: 500 },
    { month: "Jan", store: "West Elm", location: "New York", category: "Furniture", actual: 400 },
    { month: "Jan", store: "West Elm", location: "Texas", category: "Furniture", actual: 310 },

    { month: "Feb", store: "West Elm", location: "California", category: "Furniture", actual: 600 },
    { month: "Feb", store: "West Elm", location: "New York", category: "Furniture", actual: 500 },
    { month: "Feb", store: "West Elm", location: "Texas", category: "Furniture", actual: 300 },

    { month: "Mar", store: "West Elm", location: "California", category: "Furniture", actual: 700 },
    { month: "Mar", store: "West Elm", location: "New York", category: "Furniture", actual: 600 },
    { month: "Mar", store: "West Elm", location: "Texas", category: "Furniture", actual: 400 },

    // Forecast
    { month: "Apr", store: "West Elm", location: "California", category: "Furniture", forecast: 800 },
    { month: "Apr", store: "West Elm", location: "New York", category: "Furniture", forecast: 600 },
    { month: "Apr", store: "West Elm", location: "Texas", category: "Furniture", forecast: 400 },
  ];

  // FILTER
  const filteredData = data.filter((item) => {
    const storeMatch =
      selectedStores.length === 0 || selectedStores.includes(item.store);

    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.category);

    const locationMatch =
      !selectedLocation || item.location === selectedLocation;

    return storeMatch && categoryMatch && locationMatch;
  });

  // GROUP BY MONTH (MERGE ACTUAL + FORECAST)
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

  // GROUP BY LOCATION (for donut chart)
  const locationMap = {};

  filteredData.forEach((item) => {
    const key = item.location;

    if (!locationMap[key]) {
      locationMap[key] = 0;
    }

    const value = item.actual || item.forecast || 0;
    locationMap[key] += value;
  });

  const locationData = Object.keys(locationMap).map((loc) => ({
    name: loc,
    value: locationMap[loc],
  }));

  

  // METRICS
  const totalActual = chartData.reduce(
    (sum, item) => sum + (item.actual || 0),
    0
  );

  const totalForecast = chartData.reduce(
    (sum, item) => sum + (item.forecast || 0),
    0
  );
  const values = chartData.map(
    (d) => (d.actual !== 0 ? d.actual : d.forecast)
  );

  const mean =
    values.reduce((sum, v) => sum + v, 0) / values.length;

  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
    values.length;

  const stdDev = Math.sqrt(variance);
  const anomalies = chartData.filter((d) => {
    const value = d.actual !== 0 ? d.actual : d.forecast;
    return Math.abs(value - mean) > 1.2 * stdDev;
  });
  const insights = [];

    // Trend Insight
  if (totalForecast > totalActual) {
    insights.push("Revenue is expected to increase in upcoming months.");
  } else {
    insights.push("Revenue may decline based on forecast trends.");
  }

    // Category Insight
  if (selectedCategories.length === 1) {
    insights.push(
      `Category "${selectedCategories[0]}" is currently selected.`
    );
  }

    // Anomaly Insight
  if (anomalies.length > 0) {
    insights.push(
      `Detected unusual activity in ${anomalies
        .map((a) => a.month)
        .join(", ")}`
    );
  }

  return (
    <div>
      {/* KPI CARDS */}
      <div className="grid grid-cols-2 gap-4">
        <StatsCard label="Actual Revenue" value={`$${totalActual}`} />
        <StatsCard label="Forecast Revenue" value={`$${totalForecast}`} />
      </div>

      {/* CHART */}
      

      {/* FILTER INDICATOR + CLEAR BUTTON */}
      {selectedLocation && (
        <div
          style={{
            marginTop: "10px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 10px",
            background: "#F3EFE7",
            borderRadius: "20px",
            fontSize: "12px",
          }}
        >
          Location: <b>{selectedLocation}</b>
          <span
            onClick={() => setSelectedLocation(null)}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            x
          </span>
        </div>
      )}


      {/* LOWER SECTION */}
      <div className="mt-6 grid grid-cols-2 gap-4">
          <RevenueChart data={chartData} />
          <InsightsPanel insights={insights} anomalies={anomalies} />
        <StoreShareChart
          data={locationData}
          onSegmentClick={setSelectedLocation}
          selectedLocation={selectedLocation}
        />
      </div>
    </div>
  );
}

export default Dashboard;