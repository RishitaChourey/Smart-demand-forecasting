function StatsCard({ label, value, change, isDown }) {
  return (
    <div
      className="relative rounded-lg p-4"
      style={{
        background: "#FFFEFB",
        border: "1px solid #E8E2D8",
      }}
    >
      {/* Left accent line */}
      <div
        className="absolute top-0 left-0 h-full w-[3px]"
        style={{ background: "#C9A84C" }}
      />

      {/* Content */}
      <div className="ml-2">
        <div
          className="text-[10px] tracking-[2px] uppercase mb-2"
          style={{ color: "#7A7268" }}
        >
          {label}
        </div>

        <div
          className="text-[26px] font-semibold"
          style={{ color: "#2C1F14", fontFamily: "serif" }}
        >
          {value}
        </div>

        <div
          className="text-[11px] mt-1"
          style={{ color: isDown ? "#8B3A2A" : "#4A5E4C" }}
        >
          {change}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;