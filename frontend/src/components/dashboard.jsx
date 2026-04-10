import { useState,useEffect } from "react";
import StatsCard from "./cards/StatsCard";
import RevenueChart from "./charts/RevenueChart";
import InsightsPanel from "./InsightsPanel";
import MonthlyTrendChart from "./charts/MonthlyTrendChart";
import StoreShareChart from "./charts/StoreShareChart";
import ProductContributionChart from "./charts/ProductContributionChart";
import RevenueTimeSeriesChart from "./charts/RevenueTimeSeriesChart";
import StarProduct from "./StarProduct";

function Dashboard({ selectedStores, selectedCategories }) {

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [productStoreData, setProductStoreData] = useState([]);
 
  

 const productMeta = {
  "Baking Sheet": {
    image: "/products/baking-sheet.png",
    link: "https://www.westelm.com/products/baking-sheet",
  },
  "BBQ Tools": {
    image: "/products/bbq-tools.png",
    link: "https://www.westelm.com/products/bbq-tools",
  },
  "Blender": {
    image: "/products/blender.png",
    link: "https://www.westelm.com/products/blender",
  },
  "Cake Pan": {
    image: "/products/cake-pan.png",
    link: "https://www.westelm.com/products/cake-pan",
  },
  "Cast Iron Skillet": {
    image: "/products/cast-iron-skillet.png",
    link: "https://www.westelm.com/products/cast-iron-skillet",
  },
  "Chef Knife": {
    image: "/products/chef-knife.png",
    link: "https://www.westelm.com/products/chef-knife",
  },
  "Cutting Board": {
    image: "/products/cutting-board.png",
    link: "https://www.westelm.com/products/cutting-board",
  },
  "Stainless Steel Pan": {
    image: "/products/stainless-steel-pan.png",
    link: "https://www.westelm.com/products/stainless-steel-pan",
  },
  "Stand Mixer": {
    image: "/products/stand-mixer.png",
    link: "https://www.westelm.com/products/stand-mixer",
  },
  "Turkey Roaster": {
    image: "/products/turkey-roaster.png",
    link: "https://www.westelm.com/products/turkey-roaster",
  },
};

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
const productMap = {};

productStoreData.forEach((item) => {
  if (!productMap[item.product_name]) {
    productMap[item.product_name] = 0;
  }

  productMap[item.product_name] += item.units_sold;
});
let starProduct = null;
let maxUnits = 0;

Object.keys(productMap).forEach((product) => {
  if (productMap[product] > maxUnits) {
    maxUnits = productMap[product];
    starProduct = product;
  }
});
const starMeta = productMeta[starProduct]; 
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
//star product

const starProductStores = productStoreData.filter(
  (item) => item.product_name === starProduct
);

  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/store-sales")
    .then((res) => res.json())
    .then((res) => {
      const transformed = res.data.map((item) => ({
        name: item.store_name,
        value: item.total_units_sold,
      }));

      setStoreData(transformed);
    })
    .catch((err) => console.error("Store API error:", err));
}, []);

const transformProductStoreData = (apiData) => {
  const result = {};

  apiData.forEach(({ product_name, store_name, units_sold }) => {
    if (!result[product_name]) {
      result[product_name] = {
        product: product_name
      };
    }

    if (!result[product_name][store_name]) {
      result[product_name][store_name] = 0;
    }

    result[product_name][store_name] += units_sold;
  });

  return Object.values(result);
};
const stackedBarData = transformProductStoreData(productStoreData);
    useEffect(() => {
        fetch("http://localhost:8000/api/product-store-sales")
          .then((res) => res.json())
          .then((res) => {
            if (res.status === "success") {
              setProductStoreData(res.data);
            }
          })
          .catch((err) => console.error(err));
      }, []);
      useEffect(() => {
    fetch("http://127.0.0.1:8000/api/monthly-revenue")
      .then((res) => res.json())
      .then((res) => {
        // IMPORTANT: backend wraps data inside "data"
        const apiData = res.data;

        // Transform for chart
        const formatted = apiData.map((item) => {
          const [year, month] = item.month_year.split("-");

          return {
            time: new Date(year, month - 1).toLocaleString("default", {
              month: "short",
              year: "numeric",
            }),
            revenue: item.revenue,
          };
        });

            setTimeSeriesData(formatted);
          })
          .catch((err) => console.error("API ERROR:", err));
      }, []);

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
            data={storeData}
            onSegmentClick={setSelectedLocation}
            selectedLocation={selectedLocation}
          />
          
          <InsightsPanel insights={insights} anomalies={anomalies} />
           <StarProduct
              product={starProduct}
              units={maxUnits}
              meta={starMeta}
              storeBreakdown={starProductStores}
            />
        
      </div>
      <div className="mt-6">
        <RevenueTimeSeriesChart data={timeSeriesData} />
      </div>

    </div>
  );
}

export default Dashboard;