'use client';

import React, { useRef, useState, useEffect } from "react";
import SidebarAdmin from "@/components/ui/sidebar_admin";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Download,
  FileText,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// =====================
// TYPES
// =====================
interface KategoriItem {
  kategori: string;
  jumlah: number;
  color: string;
}

interface PengajuanItem {
  bulan: string;
  jumlah: number;
  diterima: number;
  ditolak: number;
}

interface TooltipPayloadItem {
  name?: string;
  value?: string | number;
  color?: string;
  dataKey?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

interface StatCardProps {
  title: string;
  value: number;
  gradient: string;
  icon: string;
}

// =====================
// Custom Tooltip
// =====================
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-xl shadow-xl px-5 py-3">
        <p className="font-bold text-gray-900 mb-2 border-b pb-2">{label}</p>
        {payload.map((item: TooltipPayloadItem, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4 py-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.name}:</span>
            </div>
            <span className="font-bold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// =====================
// STAT CARD COMPONENT
// =====================
const StatCard = ({ title, value, gradient, icon }: StatCardProps) => (
  <div className={`bg-gradient-to-br ${gradient} text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-base font-semibold opacity-90">{title}</h3>
      <span className="text-3xl">{icon}</span>
    </div>
    <p className="text-4xl font-bold">{value.toLocaleString()}</p>
    <div className="mt-3 pt-3 border-t border-white border-opacity-20">
      <p className="text-xs opacity-75">Data terkini</p>
    </div>
  </div>
);

const DashboardAdmin = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =====================
  // STATE DATA
  // =====================
  const [statistik, setStatistik] = useState({
    totalPenyedia: 0,
    totalPengguna: 0,
    totalProduk: 0,
  });
  
  const [kategoriData, setKategoriData] = useState<KategoriItem[]>([]);
  const [dataPengajuan, setDataPengajuan] = useState<PengajuanItem[]>([]);

  // =====================
  // COLOR PALETTE
  // =====================
  const colors = [
    "#3B82F6", "#10B981", "#22C55E", "#6366F1", 
    "#F59E0B", "#0EA5E9", "#EC4899", "#8B5CF6"
  ];

  // =====================
  // FETCH DATA
  // =====================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login kembali.");
        }

        const response = await fetch(
  "https://sinovabackend-production.up.railway.app/api/dashboard/dashboard-admin",
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }
);


        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Set statistik
        setStatistik(data.statistik);

        // Set kategori dengan warna
        const kategoriWithColors: KategoriItem[] = data.kategori.map((item: any, index: number) => ({
          kategori: item.kategori,
          jumlah: Number(item.jumlah),
          color: colors[index % colors.length],
        }));
        setKategoriData(kategoriWithColors);

        // Set data pengajuan
        const pengajuanData: PengajuanItem[] = data.pengajuan.map((item: any) => ({
          bulan: item.bulan,
          jumlah: Number(item.jumlah),
          diterima: Number(item.diterima),
          ditolak: Number(item.ditolak),
        }));
        setDataPengajuan(pengajuanData);

        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError((err as Error).message || "Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // =====================
  // EXPORT HANDLER
  // =====================
  const exportToPDF = () => {
    const doc = new jsPDF();
    
   // Header
doc.setFontSize(18);
doc.setFont("helvetica", "bold");
doc.text("Laporan Dashboard Admin", 14, 20);

doc.setFontSize(11);
doc.setFont("helvetica", "normal");
doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, 28);

// Statistik
doc.setFontSize(14);
doc.setFont("helvetica", "bold");
doc.text("Statistik", 14, 40);

doc.setFontSize(10);
doc.setFont("helvetica", "normal");
doc.text(`Total Penyedia: ${statistik.totalPenyedia}`, 14, 48);
doc.text(`Total Pengguna: ${statistik.totalPengguna}`, 14, 54);
doc.text(`Total Produk: ${statistik.totalProduk}`, 14, 60);

// Tabel Kategori
doc.setFontSize(14);
doc.setFont("helvetica", "bold");
doc.text("Kategori Layanan", 14, 72);

    autoTable(doc, {
      startY: 76,
      head: [["Kategori", "Jumlah"]],
      body: kategoriData.map((item) => [
        item.kategori,
        item.jumlah,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    // Tabel Pengajuan
const finalY = (doc as any).lastAutoTable?.finalY ?? 76;

doc.setFontSize(14);
doc.setFont("helvetica", "bold");
doc.text("Tren Pengajuan Produk", 14, finalY + 10);

    
    autoTable(doc, {
      startY: finalY + 14,
      head: [["Bulan", "Total", "Diterima", "Ditolak"]],
      body: dataPengajuan.map((item) => [
        item.bulan,
        item.jumlah,
        item.diterima,
        item.ditolak,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    doc.save(`laporan-dashboard-${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportDropdown(false);
  };

  const exportToExcel = () => {
    // Sheet 1: Statistik
    const statistikSheet = XLSX.utils.json_to_sheet([
      { Keterangan: 'Total Penyedia', Jumlah: statistik.totalPenyedia },
      { Keterangan: 'Total Pengguna', Jumlah: statistik.totalPengguna },
      { Keterangan: 'Total Produk', Jumlah: statistik.totalProduk },
    ]);
    
    // Sheet 2: Kategori
    const kategoriSheet = XLSX.utils.json_to_sheet(
      kategoriData.map(item => ({
        Kategori: item.kategori,
        Jumlah: item.jumlah
      }))
    );
    
    // Sheet 3: Pengajuan
    const pengajuanSheet = XLSX.utils.json_to_sheet(
      dataPengajuan.map(item => ({
        Bulan: item.bulan,
        Total: item.jumlah,
        Diterima: item.diterima,
        Ditolak: item.ditolak
      }))
    );
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, statistikSheet, 'Statistik');
    XLSX.utils.book_append_sheet(workbook, kategoriSheet, 'Kategori');
    XLSX.utils.book_append_sheet(workbook, pengajuanSheet, 'Pengajuan');
    
    // Export
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(
      new Blob([buffer]), 
      `laporan-dashboard-${new Date().toISOString().split('T')[0]}.xlsx`
    );
    setShowExportDropdown(false);
  };

  // =====================
  // LOADING STATE
  // =====================
  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <SidebarAdmin />
        <main className="flex-1 overflow-y-auto" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 mx-auto"></div>
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
              </div>
              <p className="mt-6 text-gray-700 font-medium text-lg">Memuat data dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =====================
  // ERROR STATE
  // =====================
  if (error) {
    return (
      <div className="flex h-screen bg-white">
        <SidebarAdmin />
        <main className="flex-1 overflow-y-auto" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-red-200">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">❌</span>
                </div>
                <p className="font-bold text-xl text-gray-900 mb-2">Terjadi Kesalahan</p>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* SIDEBAR */}
      <SidebarAdmin />

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-bold text-[#1F4E73]">
                Dashboard Admin
              </h1>
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Selamat datang Admin — pantau data kategori & laporan
              </p>
            </div>

            {/* EXPORT */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Download size={20} />
                <span className="font-medium">Export Laporan</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    showExportDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border-2 border-gray-100 z-20 overflow-hidden">
                  <button
                    onClick={exportToPDF}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 transition-colors duration-150"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-red-600" size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Export ke PDF</p>
                      <p className="text-xs text-gray-500">Dokumen format PDF</p>
                    </div>
                  </button>

                  <div className="border-t border-gray-100"></div>

                  <button
                    onClick={exportToExcel}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-green-50 transition-colors duration-150"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileSpreadsheet className="text-green-600" size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Export ke Excel</p>
                      <p className="text-xs text-gray-500">Spreadsheet CSV/XLSX</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* STATISTIK */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard 
              title="Total Penyedia" 
              value={statistik.totalPenyedia} 
              gradient="from-blue-500 to-blue-600"
              icon="👥"
            />
            <StatCard 
              title="Total Pengguna" 
              value={statistik.totalPengguna} 
              gradient="from-green-500 to-green-600"
              icon="👤"
            />
            <StatCard 
              title="Total Produk" 
              value={statistik.totalProduk} 
              gradient="from-yellow-500 to-orange-500"
              icon="📦"
            />
          </div>

          {/* BAR CHART */}
          <section className="bg-white p-8 rounded-3xl shadow-xl mb-10 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Kategori Layanan Terpopuler</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Distribusi produk berdasarkan kategori
                </p>
              </div>
              <div className="px-4 py-2 bg-blue-50 rounded-lg">
                <span className="text-sm font-semibold text-blue-600">
                  {kategoriData.length} Kategori
                </span>
              </div>
            </div>
            {kategoriData.length > 0 ? (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kategoriData}>
                    <defs>
                      {kategoriData.map((item, i) => (
                        <linearGradient key={i} id={`gradient${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={item.color} stopOpacity={0.8}/>
                          <stop offset="100%" stopColor={item.color} stopOpacity={0.3}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="kategori" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                    <Bar dataKey="jumlah" radius={[12, 12, 0, 0]}>
                      {kategoriData.map((item, i) => (
                        <Cell key={i} fill={`url(#gradient${i})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <p className="text-gray-500 font-medium">Tidak ada data kategori</p>
              </div>
            )}
          </section>

          {/* BAR CHART GROUPED - PENGAJUAN PRODUK */}
          <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tren Pengajuan Produk</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Perbandingan pengajuan diterima dan ditolak per bulan
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-600 font-medium">Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600 font-medium">Diterima</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-600 font-medium">Ditolak</span>
                </div>
              </div>
            </div>
            {dataPengajuan.length > 0 ? (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataPengajuan}>
                    <defs>
                      <linearGradient id="gradientTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      </linearGradient>
                      <linearGradient id="gradientDiterima" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.4}/>
                      </linearGradient>
                      <linearGradient id="gradientDitolak" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#EF4444" stopOpacity={0.4}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="bulan" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                    <Bar 
                      dataKey="jumlah" 
                      fill="url(#gradientTotal)" 
                      radius={[8, 8, 0, 0]} 
                      name="Total"
                      maxBarSize={60}
                    />
                    <Bar 
                      dataKey="diterima" 
                      fill="url(#gradientDiterima)" 
                      radius={[8, 8, 0, 0]} 
                      name="Diterima"
                      maxBarSize={60}
                    />
                    <Bar 
                      dataKey="ditolak" 
                      fill="url(#gradientDitolak)" 
                      radius={[8, 8, 0, 0]} 
                      name="Ditolak"
                      maxBarSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <p className="text-gray-500 font-medium">Tidak ada data pengajuan</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;