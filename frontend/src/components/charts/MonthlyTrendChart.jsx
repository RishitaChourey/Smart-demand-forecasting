import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function MonthlyTrendChart({data}) {
const trendData = data.map((item) => ({
  month: item.month,
  sales: item.actual !== 0 ? item.actual : item.forecast,
}));
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
        Monthly Sales Trend (Past 12 Months)
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />
          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="#C9A84C"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyTrendChart;