import { useEffect, useState } from "react";

export default function SimulatorPanel({ simState, setSimState }) {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/product-store-sales")
      .then((res) => res.json())
      .then((res) => {
        const data = res.data || [];

        const uniqueStores = [
          ...new Set(data.map((d) => d.store_name)),
        ];
        const uniqueProducts = [
          ...new Set(data.map((d) => d.product_name)),
        ];

        setStores(uniqueStores);
        setProducts(uniqueProducts);
      });
  }, []);

  const update = (key, value) => {
    setSimState((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= RUN ================= */
  const handleRun = () => {
    console.log("Simulation Payload:", simState);
  };

  return (
    <div className="w-[280px] bg-panel h-screen overflow-y-auto p-4 border-r border-borderLight text-xs">
      
      {/* HEADER */}
      <div className="mb-4">
        <div className="text-[10px] tracking-[0.3em] text-gold mb-2">
          SCENARIO SIMULATOR
        </div>
        <div className="border-b border-borderLight"></div>
      </div>

      {/* ================= FILTER ================= */}
      <Section title="Filters">
        <Dropdown
          label="Store"
          value={simState.store}
          options={stores}
          onChange={(val) => update("store", val)}
        />

        <Dropdown
          label="Product"
          value={simState.product}
          options={products}
          onChange={(val) => update("product", val)}
        />
      </Section>

      {/* ================= SIMULATION ================= */}
      <Section title="Weather Conditions">
        <WeatherGrid
          value={simState.weather}
          onChange={(val) => update("weather", val)}
        />
      </Section>

      <Section>
        <Slider
          label="Avg Temperature (°C)"
          value={simState.temp}
          min={0}
          max={50}
          step={1}
          onChange={(val) => update("temp", val)}
        />

        <Slider
          label="Rainfall (mm/day)"
          value={simState.rainfall}
          min={0}
          max={200}
          step={5}
          onChange={(val) => update("rainfall", val)}
        />

        <Slider
          label="Humidity (%)"
          value={simState.humidity}
          min={0}
          max={100}
          step={5}
          onChange={(val) => update("humidity", val)}
        />

        <Toggle
          label="Real-time Signal"
          value={simState.realtime}
          onChange={(val) => update("realtime", val)}
        />
      </Section>

      {/* ================= PROMO ================= */}
      <Section title="Promotions & Discounts">
        <Toggle
          label="Enable Promo"
          value={simState.promo}
          onChange={(val) => update("promo", val)}
        />

        {simState.promo && (
          <>
            <Dropdown
              label="Promo Type"
              value={simState.promoType}
              options={[
                "Percent Off",
                "BOGO",
                "Bundle",
                "Flash Sale",
              ]}
              onChange={(val) => update("promoType", val)}
            />

            <Slider
              label="Discount %"
              value={simState.discount}
              min={0}
              max={50}
              step={1}
              onChange={(val) => update("discount", val)}
            />

            <DateInput
              label="Start Date"
              value={simState.startDate}
              onChange={(val) => update("startDate", val)}
            />

            <DateInput
              label="End Date"
              value={simState.endDate}
              onChange={(val) => update("endDate", val)}
            />
          </>
        )}
      </Section>

      {/* BUTTON */}
      <button
        onClick={handleRun}
        className="w-full mt-4 py-2 bg-brown text-white rounded-lg text-xs tracking-wide hover:opacity-90"
      >
        RUN SIMULATION
      </button>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Section({ title, children }) {
  return (
    <div className="mb-4">
      {title && (
        <div className="text-[10px] tracking-[0.2em] text-muted mb-2 uppercase">
          {title}
        </div>
      )}
      <div className="bg-cream border border-borderLight rounded-lg p-3">
        {children}
      </div>
    </div>
  );
}

/* DROPDOWN */
function Dropdown({ label, value, options, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded-lg bg-brown text-white text-xs border border-borderLight"
      >
        <option value="">Select</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

/* WEATHER */
function WeatherGrid({ value, onChange }) {
  const options = [
    { name: "Sunny", icon: "☀️" },
    { name: "Cloudy", icon: "⛅" },
    { name: "Rainy", icon: "🌧️" },
    { name: "Stormy", icon: "⛈️" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <div
          key={opt.name}
          onClick={() => onChange(opt.name)}
          className={`p-2 rounded-lg border cursor-pointer text-center transition
          ${
            value === opt.name
              ? "bg-brown text-white border-brown"
              : "bg-white border-borderLight text-gray-700"
          }`}
        >
          <div className="text-sm">{opt.icon}</div>
          <div className="text-[10px] mt-1">{opt.name}</div>
        </div>
      ))}
    </div>
  );
}

/* SLIDER */
function Slider({ label, value, min, max, step, onChange }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[11px] mb-1">
        <span>{label}</span>
        <span className="text-gold">{value}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-gold"
      />
    </div>
  );
}

/* TOGGLE */
function Toggle({ label, value, onChange }) {
  return (
    <div
      className="flex justify-between items-center mb-3 cursor-pointer"
      onClick={() => onChange(!value)}
    >
      <span className="text-[11px]">{label}</span>
      <div
        className={`w-8 h-4 rounded-full ${
          value ? "bg-gold" : "bg-gray-300"
        } relative`}
      >
        <div
          className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition ${
            value ? "left-4" : "left-1"
          }`}
        />
      </div>
    </div>
  );
}

/* DATE */
function DateInput({ label, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] mb-1">{label}</label>
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded-lg border border-borderLight text-xs"
      />
    </div>
  );
}