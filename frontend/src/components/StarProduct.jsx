function StarProduct({ product, units, meta, storeBreakdown }) {
  if (!product) return null;

  const image = meta?.image;
  const link = meta?.link;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #FFFFFF, #FAF8F4)",
        padding: "18px",
        borderRadius: "14px",
        border: "1px solid #E5E5E5",
        display: "flex",
        gap: "16px",
        alignItems: "center",
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* GOLD ACCENT STRIP */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "6px",
          background: "#C9A84C",
        }}
      />

      {/* PRODUCT IMAGE */}
      <div
        style={{
          position: "relative",
        }}
      >
        <img
          src={image}
          alt={product}
          style={{
            width: "150px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "10px",
            border: "2px solid #F0E6D2",
          }}
        />

        {/* BADGE */}
        <div
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            background: "#C9A84C",
            color: "#fff",
            fontSize: "10px",
            padding: "4px 6px",
            borderRadius: "6px",
            fontWeight: "600",
          }}
        >
          ★ TOP
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1 }}>
        {/* TITLE */}
        <div
          style={{
            fontSize: "20px",
            color: "#7A6E5A",
            marginBottom: "4px",
            letterSpacing: "0.5px",
          }}
        >
          STAR PRODUCT
        </div>

        {/* PRODUCT NAME (PRIMARY FOCUS) */}
        <div
          style={{
            fontSize: "25px",
            fontWeight: "700",
            color: "#1E2D3D",
            marginBottom: "6px",
          }}
        >
          {product}
        </div>

        {/* KPI */}
        <div
          style={{
            fontSize: "13px",
            color: "#555",
            marginBottom: "8px",
          }}
        >
          Units Sold:{" "}
          <span
            style={{
              fontWeight: "600",
              color: "#C9A84C",
            }}
          >
            {units.toLocaleString()}
          </span>
        </div>

        {/* STORE BREAKDOWN */}
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            marginBottom: "8px",
          }}
        >
          {storeBreakdown.slice(0, 2).map((s, i) => (
            <div key={i}>
              {s.store_name}: {s.units_sold.toLocaleString()}
            </div>
          ))}
          {storeBreakdown.length > 2 && (
            <div style={{ fontSize: "11px", color: "#999" }}>
              +{storeBreakdown.length - 2} more stores
            </div>
          )}
        </div>

        {/* CTA */}
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: "12px",
            color: "#C9A84C",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          View Product →
        </a>
      </div>
    </div>
  );
}

export default StarProduct;