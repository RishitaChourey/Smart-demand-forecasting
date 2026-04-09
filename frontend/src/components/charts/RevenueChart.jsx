import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

function RevenueChart({ data }) {
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
        Revenue Forecast vs Actual
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />
          <YAxis />

          <Tooltip />
          <Legend />

          {/* ACTUAL */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#C9A84C"
            strokeWidth={3}
            name="Actual"
          />

          {/* FORECAST */}
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#7A6E5A"
            strokeWidth={3}
            strokeDasharray="5 5"
            name="Forecast"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;