import StatsCard from  "./components/cards/StatsCard";

function App() {
  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      <StatsCard title="Revenue" value="$5000" />
      <StatsCard title="Users" value="1200" />
      <StatsCard title="Orders" value="320" />
    </div>
  );
}

export default App;