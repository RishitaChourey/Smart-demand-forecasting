import { useState } from "react";

function PIL2() {
  const [storeId, setStoreId] = useState("all");
  const [productId, setProductId] = useState("all");
  const [baselineStatus, setBaselineStatus] = useState(null);
  const [simStatus, setSimStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("weather");

  // Weather state
  const [weatherCondition, setWeatherCondition] = useState("");
  const [avgTemp, setAvgTemp] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [humidity, setHumidity] = useState("");
  const [weatherConflict, setWeatherConflict] = useState([]);

  // Promo state
  const [promoType, setPromoType] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoStart, setPromoStart] = useState("");
  const [promoEnd, setPromoEnd] = useState("");

  // Signal state
  const [signalType, setSignalType] = useState("");
  const [signalStrength, setSignalStrength] = useState(0);

    const [lastBaselineRunId, setLastBaselineRunId] = useState(null);
  const [lastSimRunId, setLastSimRunId] = useState(null);
  const getStoreIds = () =>
    storeId === "all" ? [1, 2, 3, 4, 5, 6] : [parseInt(storeId)];

  const handleConditionChange = (val) => {
    setWeatherCondition(val);
    let newRain = rainfall;
    let newTemp = avgTemp;
    if (val === "Stormy") {
      if (!rainfall || parseFloat(rainfall) < 80) { newRain = "80"; setRainfall("80"); }
      if (!avgTemp || parseFloat(avgTemp) > 15) { newTemp = "15"; setAvgTemp("15"); }
    }
    checkConflicts(val, newRain, newTemp);
  };

  const checkConflicts = (cond, rain, temp) => {
    const conflicts = [];
    if (cond === "Sunny" && parseFloat(rain) > 20)
      conflicts.push("Sunny + rainfall >20mm — rainfall will be clamped to 20mm");
    if (cond === "Stormy" && parseFloat(temp) > 15)
      conflicts.push("Stormy + temp >15°C — temp will be clamped to 15°C");
    setWeatherConflict(conflicts);
  };

  const discountBadge = () => {
    if (discount === 0) return null;
    if (discount < 20)
      return <span style={badgeStyle("warning")}>Below 20% — no uplift modeled</span>;
    return <span style={badgeStyle("success")}>Effective — demand uplift modeled</span>;
  };

  const signalMultiplier = () => {
    if (signalStrength === 0) return "No multiplier applied";
    return `Predicted units × ${(1 + signalStrength * 2).toFixed(2)} (${Math.round(signalStrength * 100)}% strength)`;
  };

   const buildOverrides = () => {
    const overrides = {};
    // product_id is no longer in overrides — sent separately at top level

    let clampedRain = parseFloat(rainfall);
    let clampedTemp = parseFloat(avgTemp);
    if (weatherCondition === "Sunny" && clampedRain > 20) clampedRain = 20;
    if (weatherCondition === "Stormy") {
      if (clampedRain < 80) clampedRain = 80;
      if (clampedTemp > 15) clampedTemp = 15;
    }
    if (weatherCondition) overrides.weather_condition = weatherCondition;
    if (!isNaN(clampedRain)) overrides.rainfall_mm = clampedRain;
    if (!isNaN(clampedTemp)) overrides.avg_temp = clampedTemp;
    if (humidity !== "") overrides.humidity = parseFloat(humidity);

    if (promoType && discount >= 20) {
      overrides.promo_type = parseInt(promoType);
      overrides.discount_pct = Math.min(discount, 50) / 100;
      if (promoStart) overrides.promo_start = promoStart;
      if (promoEnd) overrides.promo_end = promoEnd;
    }

    if (signalType && signalStrength > 0) {
      overrides.signal_type = signalType;
      overrides.signal_strength = signalStrength;
    }

    return overrides;
  };

  // --- REPLACE runBaseline WITH THIS ---
  const runBaseline = async () => {
  const stores = getStoreIds();
  // Baseline always runs all 10 products regardless of productId dropdown
  const expectedRows = stores.length * 10 * 7;

  setBaselineStatus({ type: "load", msg: `Running baseline — expecting ${expectedRows} rows across ${stores.length} store(s)...` });
  try {
    let lastRunId = null;
    for (const sid of stores) {
      const res = await fetch("http://localhost:8000/api/predict/predict_baseline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_id: sid }),
        // product_id intentionally not sent — backend always runs all products
      });
      if (!res.ok) {
        const err = await res.json();
        setBaselineStatus({ type: "err", msg: `Error on store ${sid}: ${err.detail || res.statusText}` });
        return;
      }
      const json = await res.json();
      lastRunId = json.run_id;
    }
    setLastBaselineRunId(lastRunId);
    setBaselineStatus({ type: "ok", msg: `Done — ${expectedRows} rows stored. Run ID: ${lastRunId}` });
  } catch (e) {
    setBaselineStatus({ type: "err", msg: `Network error: ${e.message}` });
  }
};

const runSimulation = async () => {
  const stores = getStoreIds();
  const product = productId === "all" ? null : parseInt(productId);
  const overrides = buildOverrides();
  // Simulation respects product filter
  const expectedRows = stores.length * (product ? 1 : 10) * 7;

  setSimStatus({ type: "load", msg: `Running simulation — expecting ${expectedRows} rows across ${stores.length} store(s)...` });
  try {
    let lastRunId = null;
    for (const sid of stores) {
      const res = await fetch("http://localhost:8000/api/predict/predict_simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_id: sid, product_id: product, overrides }),
      });
      if (!res.ok) {
        const err = await res.json();
        setSimStatus({ type: "err", msg: `Error on store ${sid}: ${err.detail || res.statusText}` });
        return;
      }
      const json = await res.json();
      lastRunId = json.run_id;
    }
    setLastSimRunId(lastRunId);
    setSimStatus({ type: "ok", msg: `Done — ${expectedRows} rows stored. Run ID: ${lastRunId}` });
  } catch (e) {
    setSimStatus({ type: "err", msg: `Network error: ${e.message}` });
  }
};
  const badgeStyle = (type) => ({
    display: "inline-flex",
    alignItems: "center",
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 6,
    fontWeight: 500,
    background: `var(--color-background-${type})`,
    color: `var(--color-text-${type})`,
  });

  const statusStyle = (type) => ({
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    marginTop: 10,
    background: `var(--color-background-${type === "load" ? "info" : type === "ok" ? "success" : "danger"})`,
    color: `var(--color-text-${type === "load" ? "info" : type === "ok" ? "success" : "danger"})`,
  });

  const sectionStyle = {
    background: "var(--color-background-primary)",
    border: "0.5px solid var(--color-border-tertiary)",
    borderRadius: 12,
    padding: "1.25rem",
    marginBottom: "1rem",
  };

  const labelStyle = { fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 4, display: "block" };
  const inputStyle = { width: "100%", height: 36, padding: "0 10px", border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontSize: 14 };
  const rowStyle = { display: "flex", gap: 12, marginBottom: 12 };
  const fieldStyle = { display: "flex", flexDirection: "column", flex: 1 };
  

  return (
    <div style={{ maxWidth: 640, fontFamily: "var(--font-sans)", color: "var(--color-text-primary)", padding: "1rem 0" }}>

      {/* Section 1 — Scope */}
      <div style={sectionStyle}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
          1 — scope
        </div>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Store</label>
            <select style={inputStyle} value={storeId} onChange={(e) => setStoreId(e.target.value)}>
              <option value="all">All stores (1–6)</option>
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>Store {n}</option>)}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Product</label>
            <select style={inputStyle} value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="all">All products (1–10)</option>
              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>Product {n}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={runBaseline}
          style={{ width: "100%", height: 40, borderRadius: 8, border: "none", background: "var(--color-text-primary)", color: "var(--color-background-primary)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
        >
          Run baseline prediction
        </button>
        {baselineStatus && <div style={statusStyle(baselineStatus.type)}>{baselineStatus.msg}</div>}
      </div>

      {/* Section 2 — Simulation */}
      <div style={sectionStyle}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
          2 — simulation overrides
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: "1rem" }}>
          {["weather", "promo", "signal"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ flex: 1, height: 32, border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, background: activeTab === tab ? "var(--color-text-primary)" : "var(--color-background-primary)", color: activeTab === tab ? "var(--color-background-primary)" : "var(--color-text-secondary)", fontSize: 13, cursor: "pointer" }}
            >
              {tab === "signal" ? "realtime signal" : tab}
            </button>
          ))}
        </div>

        {/* Weather tab */}
        {activeTab === "weather" && (
          <div>
            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Condition</label>
                <select style={inputStyle} value={weatherCondition} onChange={(e) => handleConditionChange(e.target.value)}>
                  <option value="">— none —</option>
                  <option value="Sunny">Sunny</option>
                  <option value="Cloudy">Cloudy</option>
                  <option value="Rainy">Rainy</option>
                  <option value="Stormy">Stormy</option>
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Avg temp (°C)</label>
                <input style={inputStyle} type="number" min="-5" max="50" placeholder="e.g. 28" value={avgTemp}
                  onChange={(e) => { setAvgTemp(e.target.value); checkConflicts(weatherCondition, rainfall, e.target.value); }} />
              </div>
            </div>
            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Rainfall (mm/day)</label>
                <input style={inputStyle} type="number" min="0" max="200" placeholder="0–200" value={rainfall}
                  onChange={(e) => { setRainfall(e.target.value); checkConflicts(weatherCondition, e.target.value, avgTemp); }} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Humidity (%)</label>
                <input style={inputStyle} type="number" min="0" max="100" placeholder="0–100" value={humidity}
                  onChange={(e) => setHumidity(e.target.value)} />
              </div>
            </div>
            {weatherConflict.length > 0 && (
              <div style={{ background: "var(--color-background-warning)", color: "var(--color-text-warning)", borderRadius: 8, padding: "8px 12px", fontSize: 12, marginBottom: 8 }}>
                {weatherConflict.map((c, i) => <div key={i}>{c}</div>)}
              </div>
            )}
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
              Stormy auto-sets rainfall ≥80mm, temp ≤15°C · Sunny clamps rainfall ≤20mm · Applied before model inference
            </div>
          </div>
        )}

        {/* Promo tab */}
        {activeTab === "promo" && (
          <div>
            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Promo type</label>
                <select style={inputStyle} value={promoType} onChange={(e) => setPromoType(e.target.value)}>
                  <option value="">— none —</option>
                  <option value="1">Percent off</option>
                  <option value="2">BOGO</option>
                  <option value="3">Bundle</option>
                  <option value="4">Flash sale</option>
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Discount %</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="range" min="0" max="50" step="1" value={discount}
                    onChange={(e) => setDiscount(parseInt(e.target.value))}
                    style={{ flex: 1 }} />
                  <span style={{ fontSize: 14, fontWeight: 500, minWidth: 36, textAlign: "right" }}>{discount}%</span>
                </div>
                <div style={{ marginTop: 4 }}>{discountBadge()}</div>
              </div>
            </div>
            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Start date</label>
                <input style={inputStyle} type="date" value={promoStart} onChange={(e) => setPromoStart(e.target.value)} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>End date</label>
                <input style={inputStyle} type="date" value={promoEnd} onChange={(e) => setPromoEnd(e.target.value)} />
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
              Discount cap: 50% · Below 20% → no demand uplift modeled · Date range must fall within the 7-day forecast window
            </div>
          </div>
        )}

        {/* Signal tab */}
        {activeTab === "signal" && (
          <div>
            <div style={{ ...fieldStyle, marginBottom: 12 }}>
              <label style={labelStyle}>Signal type</label>
              <select style={inputStyle} value={signalType} onChange={(e) => setSignalType(e.target.value)}>
                <option value="">— none —</option>
                <option value="Viral Social Media">Viral social media</option>
                <option value="News Mention">News mention</option>
                <option value="Influencer">Influencer</option>
                <option value="Sudden Shortage">Sudden shortage</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Signal strength</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="range" min="0" max="1" step="0.01" value={signalStrength}
                  onChange={(e) => setSignalStrength(parseFloat(e.target.value))}
                  style={{ flex: 1 }} />
                <span style={{ fontSize: 14, fontWeight: 500, minWidth: 36, textAlign: "right" }}>{signalStrength.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 6 }}>{signalMultiplier()}</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 8 }}>
              Post-model multiplier: units × (1 + strength × 2) · Max spike = 3× at strength 1.0
            </div>
          </div>
        )}

        <hr style={{ border: "none", borderTop: "0.5px solid var(--color-border-tertiary)", margin: "12px 0" }} />
        <button
          onClick={runSimulation}
          style={{ width: "100%", height: 40, borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
        >
          Run simulation prediction
        </button>
        {simStatus && <div style={statusStyle(simStatus.type)}>{simStatus.msg}</div>}
      </div>
    </div>
  );
}

export default PIL2;