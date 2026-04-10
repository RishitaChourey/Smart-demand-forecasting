import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function MonthlyTrendChart() {
  // DUMMY DATA (12 months)
  const data = [
    { month: "Jan", sales: 1200 },
    { month: "Feb", sales: 1400 },
    { month: "Mar", sales: 1700 },
    { month: "Apr", sales: 1600 },
    { month: "May", sales: 1800 },
    { month: "Jun", sales: 2000 },
    { month: "Jul", sales: 2200 },
    { month: "Aug", sales: 2100 },
    { month: "Sep", sales: 2300 },
    { month: "Oct", sales: 2500 },
    { month: "Nov", sales: 2700 },
    { month: "Dec", sales: 3000 },
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
        Monthly Sales Trend (Past 12 Months)
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
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