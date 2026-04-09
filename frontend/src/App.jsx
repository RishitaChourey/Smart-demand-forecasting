import { useState } from "react";
import StatsCard from "./components/cards/StatsCard";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>
      
      {/* TOPBAR */}
      <Topbar activePage={activePage} setActivePage={setActivePage} />

      {/* MAIN LAYOUT */}
      <div className="flex">
        
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6">

          {activePage === "dashboard" && (
            <div className="grid grid-cols-4 gap-4">
              <StatsCard label="Revenue" value="$5000" />
              <StatsCard label="Users" value="1200" />
              <StatsCard label="Orders" value="320" />
              <StatsCard label="Growth" value="+12%" />
            </div>
          )}

          {activePage === "pil" && (
            <div className="text-center mt-20">
              <h1 className="text-3xl">PIL Page</h1>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;