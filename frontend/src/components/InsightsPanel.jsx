function InsightsPanel({ insights, anomalies }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #E5E5E5",
      }}
    >
      <h3 style={{ fontSize: "14px", marginBottom: "10px" }}>
        AI Insights
      </h3>

      {/* INSIGHTS */}
      <ul>
        {insights.map((insight, idx) => (
          <li key={idx}>• {insight}</li>
        ))}
      </ul>

      {/* ANOMALIES */}
      {anomalies.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h4 style={{ color: "red" }}>Anomalies</h4>
          {anomalies.map((a, i) => (
            <div key={i}>
              {a.month}: {a.actual || a.forecast}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InsightsPanel;