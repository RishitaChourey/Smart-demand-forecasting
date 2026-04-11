import { useState } from "react";
import SimulatorPanel from "../SimulatorPanel";
import PILContent from "../PILContent";

export default function PILLayout() {
  const [simState, setSimState] = useState({
  store: "",
  product: "",

  weather: "Sunny",
  temp: 25,
  rainfall: 0,
  humidity: 50,
  realtime: false,

  promo: false,
  promoType: "Percent Off",
  discount: 10,
  startDate: "",
  endDate: "",
});

  return (
    <div style={{ display: "flex" }}>
      <SimulatorPanel simState={simState} setSimState={setSimState} />
      <PILContent simState={simState} />
    </div>
  );
}