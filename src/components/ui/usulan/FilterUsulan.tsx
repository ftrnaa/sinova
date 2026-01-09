"use client";

import { Search } from "lucide-react";

interface FilterUsulanProps {
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  search: string;
  setSearch: (v: string) => void;
  counts: {
    total: number;
    tersedia: number;
    dikerjakan: number;
  };
}

export default function FilterUsulan({
  selectedFilter,
  setSelectedFilter,
  search,
  setSearch,
  counts
}: FilterUsulanProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Cari usulan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "semua", label: "Semua", total: counts.total },
            { key: "Tersedia", label: "Tersedia", total: counts.tersedia },
            { key: "Sedang Dikerjakan", label: "Dikerjakan", total: counts.dikerjakan }
          ].map(btn => (
            <button
              key={btn.key}
              onClick={() => setSelectedFilter(btn.key)}
              className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                selectedFilter === btn.key 
                  ? "bg-[#1F4E73] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {btn.label} ({btn.total})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
