"use client";

import React, { useState, useEffect } from "react";
import SidebarPenyedia from "@/components/ui/sidebar_penyedia";
import { List, CheckCircle, Clock, AlertCircle } from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// =====================
// TYPES
// =====================
interface Statistik {
  total: number;
  diterima: number;
  menunggu: number;
  ditolak: number;
}

interface Produk {
  id: number;
  nama_produk: string;
  nama_kategori: string;
  harga: number;
  status: string;
  created_at: string;
}

interface DataStatus {
  name: string;
  value: number;
  [key: string]: string | number;
}


interface DataBulan {
  bulan: string;
  jumlah: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: {
    statistik: Statistik;
    produk: Produk[];
  };
}

const COLORS = ["#22C55E", "#FACC15", "#EF4444"];

const Dashboard_penyedia = () => {
  const [statistik, setStatistik] = useState<Statistik>({
    total: 0,
    diterima: 0,
    menunggu: 0,
    ditolak: 0,
  });
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data dari backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login kembali.");
        }

        // GANTI URL INI SESUAI BACKEND ANDA
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";
        
        console.log("Fetching from:", `${API_URL}/api/dashboardpenyedia`);
        
        const response = await fetch(`${API_URL}/api/dashboardpenyedia`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})) as { message?: string };
          console.error("Error response:", errorData);
          throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }

        const result: ApiResponse = await response.json();
        console.log("API Response:", result);
        
        if (result.success) {
          setStatistik(result.data.statistik);
          setProdukList(result.data.produk);
        } else {
          throw new Error(result.message || "Gagal mengambil data");
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Hitung data untuk chart berdasarkan produk real
  const getMonthlyData = (): DataBulan[] => {
    const monthCounts: Record<string, number> = {};
    produkList.forEach((produk: Produk) => {
      const month = new Date(produk.created_at || Date.now()).toLocaleString('id-ID', { month: 'short' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    
    return Object.entries(monthCounts).map(([bulan, jumlah]) => ({
      bulan,
      jumlah,
    }));
  };

  const dataStatus: DataStatus[] = [
    { name: "Diterima", value: parseInt(String(statistik.diterima)) || 0 },
    { name: "Menunggu", value: parseInt(String(statistik.menunggu)) || 0 },
    { name: "Ditolak", value: parseInt(String(statistik.ditolak)) || 0 },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="bg-white border border-red-200 rounded-lg p-8 max-w-md shadow-lg">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Terjadi Kesalahan</h2>
          <p className="text-red-600 text-center mb-6">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Coba Lagi
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarPenyedia />

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Penyedia</h1>
          <p className="text-sm text-gray-500">Selamat datang kembali!</p>

          {/* STATISTIK */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Produk */}
            <div className="bg-[#2D6A9E] text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition">
              <div className="flex justify-between items-center mb-6">
                <div className="bg-white/20 p-6 rounded-full">
                  <List size={32} className="text-white" />
                </div>
                <p className="text-5xl font-bold">{statistik.total}</p>
              </div>
              <h3 className="text-xl font-bold">Total Produk</h3>
              <p className="text-white/90 text-sm">Total inovasi yang Anda buat</p>
            </div>

            {/* Diterima */}
            <div className="bg-[#2D6A9E] text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition">
              <div className="flex justify-between items-center mb-6">
                <div className="bg-white/20 p-6 rounded-full">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <p className="text-5xl font-bold">{statistik.diterima}</p>
              </div>
              <h3 className="text-xl font-bold">Diterima</h3>
              <p className="text-white/90 text-sm">Produk yang sudah diverifikasi</p>
            </div>

            {/* Menunggu */}
            <div className="bg-[#2D6A9E] text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition">
              <div className="flex justify-between items-center mb-6">
                <div className="bg-white/20 p-6 rounded-full">
                  <Clock size={32} className="text-white" />
                </div>
                <p className="text-5xl font-bold">{statistik.menunggu}</p>
              </div>
              <h3 className="text-xl font-bold">Menunggu Verifikasi</h3>
              <p className="text-white/90 text-sm">Sedang diperiksa oleh admin</p>
            </div>
          </div>

          {/* GRAFIK */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">Jumlah Produk per Bulan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getMonthlyData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#2D6A9E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">Status Produk</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={dataStatus} cx="50%" cy="50%" outerRadius={100} label dataKey="value">
                    {dataStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LIST PRODUK */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Daftar Produk Anda</h2>
            {produkList.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Belum ada produk</p>
            ) : (
              <div className="space-y-3">
                {produkList.slice(0, 5).map((p: Produk) => (
                  <div key={p.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 flex justify-between">
                    <div>
                      <p className="font-semibold">{p.nama_produk}</p>
                      <p className="text-xs text-gray-500">{p.nama_kategori} • Rp {p.harga?.toLocaleString('id-ID')}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full h-fit ${
                      p.status === "diterima"
                        ? "bg-green-100 text-green-700"
                        : p.status === "menunggu"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {p.status === "diterima" ? "Diterima" : 
                       p.status === "menunggu" ? "Menunggu" : "Ditolak"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <footer className="text-center text-xs text-gray-400 mt-10">
            © 2025 SINOVA — Dashboard Penyedia Inovasi
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard_penyedia;