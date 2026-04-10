import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StoreShareChart({ data, onSegmentClick, selectedLocation }) {

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
        Revenue Share by Store Location
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={dataWithPercent}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            label={({ percent }) => `${percent}%`}
            onClick={(entry) => {
              onSegmentClick((prev) =>
                prev === entry.name ? null : entry.name
              );
            }}
          >
            {dataWithPercent.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                opacity={
                  !selectedLocation || selectedLocation === entry.name
                    ? 1
                    : 0.4
                }
              />
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