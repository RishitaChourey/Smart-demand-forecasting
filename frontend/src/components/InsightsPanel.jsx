function InsightsPanel({ insights, anomalies }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #E5E5E5",
        height: "100%",
      }}
    >
      {/* TITLE */}
      <h3
        style={{
          fontSize: "14px",
          marginBottom: "16px",
          color: "#7A6E5A",
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}
      >
        AI Insights
      </h3>

      {/* INSIGHT CARDS */}
      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            style={{
              background: "#FAF8F4",
              padding: "10px",
              borderRadius: "8px",
              fontSize: "13px",
              color: "#3A3A3A",
            }}
          >
            {insight}
          </div>
        ))}
      </div>

      {/* ANOMALY SECTION */}
      {anomalies.length > 0 && (
        <div className="mt-5">
          <h4
            style={{
              fontSize: "12px",
              marginBottom: "8px",
              color: "#B94A48",
              fontWeight: "600",
            }}
          >
            Anomalies Detected
          </h4>

          <div className="space-y-2">
            {anomalies.map((a, i) => (
              <div
                key={i}
                style={{
                  background: "#FFF0F0",
                  padding: "8px",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              >
                {a.month}: ${a.actual || a.forecast}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default InsightsPanel;