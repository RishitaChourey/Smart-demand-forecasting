import { useEffect, useState } from "react";

function Sidebar({
  selectedStores,
  setSelectedStores,
  selectedCategories,
  setSelectedCategories,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA FROM API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/product-store-sales");
        const json = await res.json();

        const data = json.data || [];

        // UNIQUE STORES
        const uniqueStores = [
          ...new Set(data.map((item) => item.store_name)),
        ];

        // UNIQUE PRODUCTS
        const uniqueProducts = [
          ...new Set(data.map((item) => item.product_name)),
        ];

        setStores(uniqueStores);
        setProducts(uniqueProducts);
      } catch (err) {
        console.error("Sidebar fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // TOGGLE LOGIC
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
      {/* DATE RANGE */}
      <div className="mb-6">
        <h3 className="text-[12px] mb-3 tracking-[1px] uppercase text-[#7A6E5A]">
          Date Range
        </h3>

        <div className="">
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-2 py-1 m-2 text-xs 
                       bg-[#FAF8F4] text-[#2F2F2F]
                       border border-[#E5E5E5] rounded-md
                       focus:outline-none focus:border-[#C2B6A3] focus:bg-white"
          />

          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-2 py-1 m-2 text-xs 
                       bg-[#FAF8F4] text-[#2F2F2F]
                       border border-[#E5E5E5] rounded-md
                       focus:outline-none focus:border-[#C2B6A3] focus:bg-white"
          />
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && <p className="text-xs text-gray-500">Loading filters...</p>}

      {/* STORES */}
      {!loading && (
        <div className="mb-6">
          <h3 className="text-[12px] mb-3 tracking-[1px] uppercase text-[#7A6E5A]">
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
      )}

      {/* PRODUCTS */}
      {!loading && (
        <div>
          <h3 className="text-[12px] mb-3 tracking-[1px] uppercase text-[#7A6E5A]">
            Products
          </h3>

          {products.map((product) => (
            <label
              key={product}
              className="flex items-center gap-2 mb-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(product)}
                onChange={() =>
                  handleToggle(
                    product,
                    selectedCategories,
                    setSelectedCategories
                  )
                }
              />
              <span className="text-[13px]">{product}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sidebar;