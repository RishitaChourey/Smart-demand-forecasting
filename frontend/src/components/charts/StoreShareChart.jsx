import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StoreShareChart({ data }) {

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const dataWithPercent = data.map((item) => ({
    ...item,
    percent: ((item.value / total) * 100).toFixed(1),
  }));

  const COLORS = ["#C9A84C", "#7A6E5A", "#D6C3A3", "#A89F91"];

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
        Revenue Share by store Location
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={dataWithPercent}
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={3}
            label={({ percent }) => `${percent}%`}
          >
            {dataWithPercent.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name, props) => [
              `${props.payload.percent}%`,
              name,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StoreShareChart;