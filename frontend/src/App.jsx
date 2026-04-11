import { useState } from "react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import PIL2 from "./pages/PIL2";
import PILPage from "./pages/PILPage";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>
      
      <Topbar activePage={activePage} setActivePage={setActivePage} />

      {/* DASHBOARD LAYOUT (WITH SIDEBAR) */}
      {activePage === "dashboard" && (
        <div className="flex">
          
          <Sidebar
            selectedStores={selectedStores}
            setSelectedStores={setSelectedStores}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />

          <div className="flex-1 p-6">
            <Dashboard
              selectedStores={selectedStores}
              selectedCategories={selectedCategories}
            />
          </div>

        </div>
      )}

      {/* PIL LAYOUT (NO SIDEBAR) */}
      {activePage === "pil" && (
        <div className="p-6">
          <PILPage
            selectedStores={selectedStores}
            selectedCategories={selectedCategories}
          />
        </div>
      )}

      {/* PIL2 LAYOUT (NO SIDEBAR) */}
      {activePage === "pil2" && (
        <div className="p-6">
          <PIL2 />
        </div>
      )}

    </div>
  );
}

export default App;