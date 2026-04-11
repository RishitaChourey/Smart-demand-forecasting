function computeForecast(simState) {
  let base = 14820;

  let multiplier =
    simState.weatherImpact *
    (1 + simState.discount * 0.02) *
    (1 + simState.footTraffic * 0.01);

  return Math.round(base * multiplier);
}

export default function KPIStrip({ simState }) {
  const forecast = computeForecast(simState);

  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      <div>
        <div>7-Day Units</div>
        <div>{forecast}</div>
      </div>

      <div>
        <div>Revenue</div>
        <div>${(forecast * 100).toLocaleString()}</div>
      </div>

      <div>
        <div>Confidence</div>
        <div>91%</div>
      </div>
    </div>
  );
}