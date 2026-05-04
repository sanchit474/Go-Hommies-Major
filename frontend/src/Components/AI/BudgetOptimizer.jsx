import React, { useState } from "react";
import { OptimizeBudget } from "../../../ApiCall";
import { DollarSign, Loader, AlertCircle } from "lucide-react";

const BudgetOptimizer = () => {
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleOptimize = async () => {
    if (!budget || budget <= 0) {
      setError("Please enter a valid budget amount");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await OptimizeBudget(parseInt(budget));

      if (response?.status === 200 && response?.data?.data?.response) {
        setResult(response.data.data.response);
      } else {
        const errorMsg = response?.data?.message || response?.data?.error || "Failed to optimize budget";
        console.error("Response structure:", response?.data);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Error processing your request";
      console.error("Budget Optimizer Error:", err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-card p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <DollarSign size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Budget Optimizer</h2>
          <p className="text-xs text-slate-500">
            Get AI-powered budget optimization for your trips
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
            Your Budget (₹)
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter your total budget..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            min="0"
          />
        </div>

        <button
          onClick={handleOptimize}
          disabled={loading || !budget}
          className="w-full py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
        >
          {loading && <Loader size={20} className="animate-spin" />}
          {loading ? "Optimizing..." : "Optimize Budget"}
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 items-center">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              Optimization Results
            </h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 whitespace-pre-line text-sm leading-relaxed">
                {result}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetOptimizer;
