import PILLayout from "../components/layout/PILLayout";
import "../styles/pil.css";
export default function PILPage({ selectedStores, selectedCategories }) {
  return (
    <div className="app">
      <PILLayout
        selectedStores={selectedStores}
        selectedCategories={selectedCategories}
      />
    </div>
  );
}