import React, { useState, useEffect } from "react";
import { GetTravelInsights } from "../../../ApiCall";
import { TrendingUp, RefreshCw, Loader, AlertCircle } from "lucide-react";

const TravelInsights = () => {
  const [insights, setInsights] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await GetTravelInsights();

      if (response?.status === 200 && response?.data?.data?.response) {
        setInsights(response.data.data.response);
        setStats(response.data.data.stats);
      } else {
        const errorMsg = response?.data?.message || response?.data?.error || "Failed to fetch travel insights";
        console.error("Response structure:", response?.data);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Error loading insights";
      console.error("Travel Insights Error:", err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="modern-card p-8 flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader size={48} className="animate-spin text-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
              <TrendingUp size={20} className="text-primary" />
            </div>
          </div>
          <p className="text-slate-500 font-medium animate-pulse">Analyzing travel trends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-card p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <TrendingUp size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Travel Insights</h2>
            <p className="text-xs text-slate-500">
              AI-powered analysis of community travel data
            </p>
          </div>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="p-2.5 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50 text-primary border border-slate-100"
          title="Refresh insights"
        >
          <RefreshCw
            size={20}
            className={`${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 mb-6 items-center">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 group hover:bg-blue-50 transition-colors">
            <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-1">Total Trips</p>
            <p className="text-2xl font-black text-blue-900">{stats.totalPosts}</p>
          </div>
          <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 group hover:bg-purple-50 transition-colors">
            <p className="text-purple-600 text-[10px] font-bold uppercase tracking-wider mb-1">Vlogs</p>
            <p className="text-2xl font-black text-purple-900">
              {stats.totalVlogs}
            </p>
          </div>
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 group hover:bg-emerald-50 transition-colors">
            <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-1">Avg Budget</p>
            <p className="text-2xl font-black text-emerald-900">
              ₹{stats.avgBudget}
            </p>
          </div>
        </div>
      )}

      {insights && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <TrendingUp size={120} />
            </div>
            <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              AI Perspective
            </h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 whitespace-pre-line text-sm leading-relaxed relative z-10">
                {insights}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Last Updated</span>
              <span className="font-bold text-slate-900">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Data Source</span>
              <span className="font-bold text-slate-900 uppercase tracking-tighter">Community</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelInsights;
