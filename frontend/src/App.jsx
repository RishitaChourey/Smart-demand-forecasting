import { useState } from "react";
import Topbar from "./components/Topbar";
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

      <div className="flex">
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
          {activePage === "pil" && (
            <PILPage
              selectedStores={selectedStores}
              selectedCategories={selectedCategories}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;