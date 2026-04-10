import { useState } from "react";
import StatsCard from "./cards/StatsCard";
import RevenueChart from "./charts/RevenueChart";
import InsightsPanel from "./InsightsPanel";
import MonthlyTrendChart from "./charts/MonthlyTrendChart";
import StoreShareChart from "./charts/StoreShareChart";
import ProductContributionChart from "./charts/ProductContributionChart";
import RevenueTimeSeriesChart from "./charts/RevenueTimeSeriesChart";

function Dashboard({ selectedStores, selectedCategories }) {

  const [selectedLocation, setSelectedLocation] = useState(null);
  const timeSeriesData = [
  { month: "Jan", year: 2022, revenue: 4200 },
  { month: "Feb", year: 2022, revenue: 4600 },
  { month: "Mar", year: 2022, revenue: 5000 },
  { month: "Apr", year: 2022, revenue: 5200 },
  { month: "May", year: 2022, revenue: 5800 },
  { month: "Jun", year: 2022, revenue: 6100 },
  { month: "Jul", year: 2022, revenue: 5900 },
  { month: "Aug", year: 2022, revenue: 6200 },
  { month: "Sep", year: 2022, revenue: 6400 },
  { month: "Oct", year: 2022, revenue: 7000 },
  { month: "Nov", year: 2022, revenue: 7600 },
  { month: "Dec", year: 2022, revenue: 8200 },

  { month: "Jan", year: 2023, revenue: 5000 },
  { month: "Feb", year: 2023, revenue: 5400 },
  { month: "Mar", year: 2023, revenue: 6000 },
  { month: "Apr", year: 2023, revenue: 6400 },
  { month: "May", year: 2023, revenue: 7000 },
  { month: "Jun", year: 2023, revenue: 7600 },
  { month: "Jul", year: 2023, revenue: 7200 },
  { month: "Aug", year: 2023, revenue: 7800 },
  { month: "Sep", year: 2023, revenue: 8200 },
  { month: "Oct", year: 2023, revenue: 9000 },
  { month: "Nov", year: 2023, revenue: 9800 },
  { month: "Dec", year: 2023, revenue: 11000 },

  { month: "Jan", year: 2024, revenue: 6500 },
  { month: "Feb", year: 2024, revenue: 7000 },
  { month: "Mar", year: 2024, revenue: 7800 },
  { month: "Apr", year: 2024, revenue: 8200 },
  { month: "May", year: 2024, revenue: 9000 },
  { month: "Jun", year: 2024, revenue: 9600 },
  { month: "Jul", year: 2024, revenue: 9100 },
  { month: "Aug", year: 2024, revenue: 9900 },
  { month: "Sep", year: 2024, revenue: 10500 },
  { month: "Oct", year: 2024, revenue: 11500 },
  { month: "Nov", year: 2024, revenue: 12500 },
  { month: "Dec", year: 2024, revenue: 14000 },
];
  const data = [
  // JAN → MAR (ACTUAL DATA)
  { month: "Jan", store: "West Elm", location: "California", category: "Furniture", actual: 520 },
  { month: "Jan", store: "West Elm", location: "New York", category: "Furniture", actual: 430 },
  { month: "Jan", store: "West Elm", location: "Texas", category: "Furniture", actual: 300 },
  { month: "Jan", store: "IKEA", location: "California", category: "Furniture", actual: 650 },
  { month: "Jan", store: "IKEA", location: "New York", category: "Furniture", actual: 500 },
  { month: "Jan", store: "IKEA", location: "Texas", category: "Furniture", actual: 420 },

  { month: "Feb", store: "West Elm", location: "California", category: "Furniture", actual: 600 },
  { month: "Feb", store: "West Elm", location: "New York", category: "Furniture", actual: 520 },
  { month: "Feb", store: "West Elm", location: "Texas", category: "Furniture", actual: 320 },
  { month: "Feb", store: "IKEA", location: "California", category: "Furniture", actual: 700 },
  { month: "Feb", store: "IKEA", location: "New York", category: "Furniture", actual: 580 },
  { month: "Feb", store: "IKEA", location: "Texas", category: "Furniture", actual: 450 },

  { month: "Mar", store: "West Elm", location: "California", category: "Furniture", actual: 720 },
  { month: "Mar", store: "West Elm", location: "New York", category: "Furniture", actual: 610 },
  { month: "Mar", store: "West Elm", location: "Texas", category: "Furniture", actual: 410 },
  { month: "Mar", store: "IKEA", location: "California", category: "Furniture", actual: 780 },
  { month: "Mar", store: "IKEA", location: "New York", category: "Furniture", actual: 640 },
  { month: "Mar", store: "IKEA", location: "Texas", category: "Furniture", actual: 500 },

  // ADD CATEGORY VARIATION
  { month: "Jan", store: "West Elm", location: "California", category: "Decor", actual: 300 },
  { month: "Feb", store: "West Elm", location: "California", category: "Decor", actual: 350 },
  { month: "Mar", store: "West Elm", location: "California", category: "Decor", actual: 400 },

  { month: "Jan", store: "IKEA", location: "New York", category: "Lighting", actual: 200 },
  { month: "Feb", store: "IKEA", location: "New York", category: "Lighting", actual: 260 },
  { month: "Mar", store: "IKEA", location: "New York", category: "Lighting", actual: 300 },

  // APR → DEC (FORECAST DATA)
  { month: "Apr", store: "West Elm", location: "California", category: "Furniture", forecast: 800 },
  { month: "Apr", store: "West Elm", location: "New York", category: "Furniture", forecast: 620 },
  { month: "Apr", store: "West Elm", location: "Texas", category: "Furniture", forecast: 420 },
  { month: "Apr", store: "IKEA", location: "California", category: "Furniture", forecast: 850 },
  { month: "Apr", store: "IKEA", location: "New York", category: "Furniture", forecast: 700 },
  { month: "Apr", store: "IKEA", location: "Texas", category: "Furniture", forecast: 520 },

  { month: "May", store: "West Elm", location: "California", category: "Furniture", forecast: 850 },
  { month: "Jun", store: "West Elm", location: "California", category: "Furniture", forecast: 900 },
  { month: "Jul", store: "West Elm", location: "California", category: "Furniture", forecast: 950 },
  { month: "Aug", store: "West Elm", location: "California", category: "Furniture", forecast: 920 },
  { month: "Sep", store: "West Elm", location: "California", category: "Furniture", forecast: 980 },
  { month: "Oct", store: "West Elm", location: "California", category: "Furniture", forecast: 1050 },
  { month: "Nov", store: "West Elm", location: "California", category: "Furniture", forecast: 1150 },
  { month: "Dec", store: "West Elm", location: "California", category: "Furniture", forecast: 1300 },

  // Add variability for realism
  { month: "Jul", store: "IKEA", location: "Texas", category: "Furniture", forecast: 300 }, // dip
  { month: "Nov", store: "West Elm", location: "New York", category: "Furniture", forecast: 1400 }, // spike
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

  // GROUP BY CATEGORY + LOCATION (STACKED BAR)
  const categoryMap = {};

  filteredData.forEach((item) => {
    const category = item.category;
    const location = item.location;
    const value = item.actual || item.forecast || 0;

    if (!categoryMap[category]) {
      categoryMap[category] = { category };
    }

    if (!categoryMap[category][location]) {
      categoryMap[category][location] = 0;
    }

    categoryMap[category][location] += value;
  });

  const stackedBarData = Object.values(categoryMap);

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

  const formattedData = timeSeriesData.map((item) => ({
    time: `${item.month} ${item.year}`,
    revenue: item.revenue,
  }));

  return (
    <div>
      {/* KPI CARDS */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <StatsCard label="Actual Revenue" value={`$${totalActual}`} />
        <StatsCard label="Forecast Revenue" value={`$${totalForecast}`} />
      </div>
      <div className="mt-6">
        <ProductContributionChart data={stackedBarData} />
      </div>
      
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

      <div className="mt-6 grid grid-cols-2 gap-4">
          <RevenueChart data={chartData} />
          <StoreShareChart
            data={locationData}
            onSegmentClick={setSelectedLocation}
            selectedLocation={selectedLocation}
          />
          <InsightsPanel insights={insights} anomalies={anomalies} />
        
      </div>
      <div className="mt-6">
        <RevenueTimeSeriesChart data={formattedData} />
      </div>

    </div>
  );
}

export default Dashboard;