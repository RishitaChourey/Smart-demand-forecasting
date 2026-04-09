import { useState } from "react";

function Sidebar({
  selectedStores,
  setSelectedStores,
  selectedCategories,
  setSelectedCategories,
}) {

  // ✅ ADD THESE (YOU FORGOT THIS)
  const stores = [
    "West Elm",
    "Pottery Barn",
    "Williams Sonoma",
    "PB Teen",
  ];

  const categories = [
    "Furniture",
    "Kitchen",
    "Decor",
    "Outdoor",
  ];

  // Toggle logic
  const handleToggle = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  return (
    <div
      className="w-[260px] p-4"
      style={{
        background: "#FFFFFF",
        borderRight: "1px solid #E5E5E5",
      }}
    >
      {/* STORES */}
      <div className="mb-6">
        <h3
          className="text-[12px] mb-3 tracking-[1px] uppercase"
          style={{ color: "#7A6E5A" }}
        >
          Stores
        </h3>

        {stores.map((store) => (
          <label
            key={store}
            className="flex items-center gap-2 mb-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedStores.includes(store)}
              onChange={() =>
                handleToggle(store, selectedStores, setSelectedStores)
              }
            />
            <span className="text-[13px]">{store}</span>
          </label>
        ))}
      </div>

      {/* CATEGORIES */}
      <div>
        <h3
          className="text-[12px] mb-3 tracking-[1px] uppercase"
          style={{ color: "#7A6E5A" }}
        >
          Categories
        </h3>

        {categories.map((cat) => (
          <label
            key={cat}
            className="flex items-center gap-2 mb-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() =>
                handleToggle(cat, selectedCategories, setSelectedCategories)
              }
            />
            <span className="text-[13px]">{cat}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;