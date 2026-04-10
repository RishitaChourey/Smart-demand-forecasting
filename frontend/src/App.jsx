import { useState } from "react";
import StatsCard from "./components/cards/StatsCard";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import PIL2 from "./pages/PIL2";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>
      
      <Topbar activePage={activePage} setActivePage={setActivePage} />

      <div className="flex">
        
        {/* PASS STATE DOWN */}
        <Sidebar
          selectedStores={selectedStores}
          setSelectedStores={setSelectedStores}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />

        <div className="flex-1 p-6">

          {activePage === "dashboard" && (
            <Dashboard
              selectedStores={selectedStores}
              selectedCategories={selectedCategories}
            />
          )}

          {activePage === "pil2" && (
           <PIL2 />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;