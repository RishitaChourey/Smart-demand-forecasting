import { useState } from "react";

function Topbar({ activePage, setActivePage }) {
  return (
    <div
      className="flex items-center justify-between px-6 h-[52px]"
      style={{
        background: "#2C1F14",
        borderBottom: "1px solid rgba(201,168,76,0.3)",
      }}
    >
      {/* LEFT SECTION */}
      <div>
        <div
          className="text-[18px] tracking-[2px]"
          style={{
            color: "#E8D09A",
            fontFamily: "serif",
          }}
        >
          WILLIAMS-SONOMA GROUP
        </div>

        <div
          className="text-[9px] tracking-[3px] mt-[2px]"
          style={{ color: "#B8B3AA" }}
        >
          Demand Intelligence Platform
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">
        {/* NAV TABS */}
        <span
          onClick={() => setActivePage("dashboard")}
          className="text-[12px] tracking-[1.5px] cursor-pointer uppercase pb-1"
          style={{
            color: activePage === "dashboard" ? "#C9A84C" : "#B8B3AA",
            borderBottom:
              activePage === "dashboard"
                ? "2px solid #C9A84C"
                : "2px solid transparent",
          }}
        >
          Dashboard
        </span>

        <span
          onClick={() => setActivePage("pil")}
          className="text-[12px] tracking-[1.5px] cursor-pointer uppercase pb-1"
          style={{
            color: activePage === "pil" ? "#C9A84C" : "#B8B3AA",
            borderBottom:
              activePage === "pil"
                ? "2px solid #C9A84C"
                : "2px solid transparent",
          }}
        >
          PIL
        </span>

        {/* RIGHT TEXT */}
        <span
          className="text-[11px] tracking-[1px]"
          style={{ color: "#B8B3AA" }}
        >
          FY 2026 · Prophet/ARIMA
        </span>
      </div>
    </div>
  );
}

export default Topbar;