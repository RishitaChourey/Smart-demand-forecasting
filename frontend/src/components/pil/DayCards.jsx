export default function DayCards({ simState }) {
  const base = [2000, 2200, 2100, 1900, 2300, 2500, 2400];

  const data = base.map(
    (d) =>
      Math.round(
        d *
          simState.weatherImpact *
          (1 + simState.discount * 0.02)
      )
  );

  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      {data.map((val, i) => (
        <div
          key={i}
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        >
          <div>Day {i + 1}</div>
          <div>{val}</div>
        </div>
      ))}
    </div>
  );
}