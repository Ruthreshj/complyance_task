import React from "react";
import ROICalculator from "../components/ROICalculator";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[500px]">
        <h1 className="text-2xl font-bold mb-6 text-center">💰 Invoicing ROI Simulator</h1>
        <ROICalculator />
      </div>
    </div>
  );
}

export default App;
