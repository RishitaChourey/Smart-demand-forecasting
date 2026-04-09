import { useState } from "react";
import StatsCard from "./components/cards/StatsCard";
import Topbar from "./components/Topbar";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>
      
      {/* TOPBAR */}
      <Topbar activePage={activePage} setActivePage={setActivePage} />

      {/* CONTENT */}
      <div className="p-6">

        {activePage === "dashboard" && (
          <div className="grid grid-cols-4 gap-4">
            <StatsCard label="Total Revenue" value="$24.7M" change="▲ 12.3%" />
            <StatsCard label="Units Sold" value="183,420" change="▲ 8.1%" />
            <StatsCard label="Avg Order Value" value="$134.60" change="▼ 2.4%" isDown />
            <StatsCard label="Forecast Accuracy" value="91.4%" change="▲ 3.2pp" />
          </div>
        )}

        {activePage === "pil" && (
          <div className="text-center mt-20">
            <h1 className="text-3xl">PIL Page (Coming Soon)</h1>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;