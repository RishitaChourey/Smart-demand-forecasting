import { useState } from "react";

function PIL2() {
  const [storeId, setStoreId] = useState("");
  const [status, setStatus] = useState("");

  const runBaselinePrediction = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/predict/predict_baseline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_id: parseInt(storeId) })
      });

      const result = await response.json();
      setStatus(result.status);
    } catch (error) {
      console.error("Error running prediction:", error);
      setStatus("Error running prediction");
    }
  };

  return (
    <div>
      <h1>Baseline Prediction</h1>

      <label>
        Store ID:
        <input
          type="number"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
        />
      </label>

      <button onClick={runBaselinePrediction}>
        Run Baseline Prediction
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}

export default PIL2;
