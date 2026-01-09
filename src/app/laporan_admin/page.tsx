'use client';

import { useEffect, useState } from 'react';
import SidebarAdmin from '@/components/ui/sidebar_admin';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = 'https://sinovabackend-production.up.railway.app';

export default function LaporanAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [bulan, setBulan] = useState('');
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (bulan) params.append('bulan', bulan);
      if (tahun) params.append('tahun', tahun.toString());

      const res = await fetch(`${API_URL}/api/dashboard/laporan/dashboard?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const json = await res.json();

      if (Array.isArray(json)) {
        setData(json);
      } else if (Array.isArray(json.data)) {
        setData(json.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error('Gagal fetch laporan', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const exportExcel = () => {
    if (data.length === 0) {
      alert('Tidak ada data untuk di-export');
      return;
    }

    // Format data untuk export
    const exportData = data.map((item, index) => ({
      'No': index + 1,
      'Nama Produk': item.nama_produk,
      'Kategori': item.nama_kategori,
      'Status': item.status,
      'Tanggal Dibuat': new Date(item.created_at).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 5 },  // No
      { wch: 30 }, // Nama Produk
      { wch: 20 }, // Kategori
      { wch: 15 }, // Status
      { wch: 20 }  // Tanggal
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Produk');

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    const fileName = `Laporan_Produk_${bulan ? `Bulan_${bulan}_` : ''}Tahun_${tahun}.xlsx`;
    saveAs(new Blob([buffer]), fileName);
  };

  const exportPDF = () => {
    if (data.length === 0) {
      alert('Tidak ada data untuk di-export');
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN PRODUK', 105, 15, { align: 'center' });

    // Info filter
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let filterText = 'Periode: ';
    if (bulan) {
      const bulanNama = new Date(0, parseInt(bulan) - 1).toLocaleString('id-ID', { month: 'long' });
      filterText += `${bulanNama} `;
    } else {
      filterText += 'Semua Bulan ';
    }
    filterText += `${tahun}`;
    doc.text(filterText, 105, 22, { align: 'center' });

    doc.text(`Total Data: ${data.length} produk`, 105, 28, { align: 'center' });

    // Line
    doc.setLineWidth(0.5);
    doc.line(15, 32, 195, 32);

    // Table
    autoTable(doc, {
      head: [["No", "Produk", "Kategori", "Status", "Tanggal"]],
      body: data.map((item, index) => [
        index + 1,
        item.nama_produk,
        item.nama_kategori,
        item.status,
        new Date(item.created_at).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
      ]),
      startY: 35,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 60 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30, halign: 'center' },
        4: { cellWidth: 35, halign: 'center' },
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(
        `Halaman ${i} dari ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
      doc.text(
        `Dicetak pada: ${new Date().toLocaleString('id-ID')}`,
        105,
        doc.internal.pageSize.height - 6,
        { align: 'center' }
      );
    }

    const fileName = `Laporan_Produk_${bulan ? `Bulan_${bulan}_` : ''}Tahun_${tahun}.pdf`;
    doc.save(fileName);
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('diterima') || statusLower.includes('aktif') || statusLower.includes('tersedia')) 
      return 'bg-green-100 text-green-800 border-green-200';
    if (statusLower.includes('menunggu') || statusLower.includes('pending')) 
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (statusLower.includes('ditolak') || statusLower.includes('nonaktif') || statusLower.includes('habis')) 
      return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="flex h-screen overflow-hidden">
        <SidebarAdmin />
    
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900">📊 Laporan Produk</h1>
            <p className="text-gray-600 mt-2">Kelola dan export laporan data produk Anda</p>
          </div>

          {/* Filter & Export Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-lg font-semibold text-gray-900">Filter & Export</h2>
            </div>
            
            <div className="flex flex-wrap gap-3 items-end">
              {/* Filter Bulan */}
              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulan
                </label>
                <select
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400"
                >
                  <option value="">Semua Bulan</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Tahun */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun
                </label>
                <select
                  value={tahun}
                  onChange={(e) => setTahun(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400"
                >
                  {[2023, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tombol Terapkan Filter */}
              <button
                onClick={fetchLaporan}
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    🔍 Terapkan Filter
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="hidden lg:block w-px h-10 bg-gray-300 mx-2"></div>

              {/* Tombol Export */}
              <button
                onClick={exportExcel}
                disabled={data.length === 0}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                📊 Export Excel
              </button>

              <button
                onClick={exportPDF}
                disabled={data.length === 0}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                📄 Export PDF
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Data Produk</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Menampilkan <span className="font-semibold text-blue-600">{data.length}</span> produk
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Produk
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Tanggal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          <p className="text-gray-600 font-medium">Memuat data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl">📭</span>
                          </div>
                          <div>
                            <p className="text-gray-900 font-semibold text-lg">Tidak ada data</p>
                            <p className="text-gray-500 text-sm mt-1">Coba ubah filter atau tambah data produk baru</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((item, i) => (
                      <tr 
                        key={i} 
                        className="hover:bg-blue-50/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="text-gray-600 font-medium">{i + 1}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{item.nama_produk}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600">{item.nama_kategori}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600">
                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}