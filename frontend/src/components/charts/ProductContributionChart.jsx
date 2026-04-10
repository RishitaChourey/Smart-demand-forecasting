import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

function ProductContributionChart({ data }) {

  // Safety check
  if (!data || data.length === 0) return null;

  // Extract locations dynamically (stack keys)
  const locations = Object.keys(data[0]).filter(
    (key) => key !== "category"
  );

  // Theme colors
   const COLORS = [
    "#1E2D3D", // deep blue
    "#8B3A2A", // muted red
    "#4A5E4C", // earthy green
    "#C9A84C", // gold highlight
    "#261912", // dark brown
  ];

  return (
    <div
      style={{
        background: "#FFFFFF",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #E5E5E5",
      }}
    >
      <h3
        style={{
          fontSize: "14px",
          marginBottom: "10px",
          color: "#7A6E5A",
        }}
      >
        Units Sold by Product — Store Contributions
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          {/* X = Product */}
          <XAxis dataKey="category" />

          {/* Y = Units Sold */}
          <YAxis />

          <Tooltip />
          <Legend />

          {locations.map((loc, index) => (
            <Bar
              key={loc}
              dataKey={loc}
              stackId="total"
              fill={COLORS[index % COLORS.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProductContributionChart;