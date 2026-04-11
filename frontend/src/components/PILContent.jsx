import Header from "../components/pil/Header";
import KPIStrip from "../components/pil/KPIStrip";
import DayCards from "../components/pil/DayCards";
import ForecastChart from "../components/pil/ForecastCard";
import DriversSection from "../components/pil/DriversSection";
import XAISection from "../components/pil/XAISection";
import DayDetail from "../components/pil/DayDetail";
import InventorySection from "../components/pil/InventorySection";

export default function PILContent({ simState }) {
  return (
    <div style={{ flex: 1, padding: "20px" }}>
      <Header />
      <KPIStrip simState={simState} />
      <DayCards simState={simState} />
      <ForecastChart simState={simState} />
    </div>
  );
}