"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/ui/navbar";
import Footer from "@/components/ui/footer";

interface Kategori {
  kategori_id: number;
  nama_kategori: string;
}

interface RisetItem {
  id: string;
  judul: string;
  nama_periset: string;
  nama_kategori: string;
  dokumen_url: string;
  created_at: string;
}

export default function RisetPage() {
  const [judul, setJudul] = useState("");
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [data, setData] = useState<any[]>([]);
  const [kategoris, setKategoris] = useState<Kategori[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 4;

  // ============================
  // FETCH KATEGORI DARI DATABASE
  // ============================
  const fetchKategoris = async () => {
    try {
      const res = await fetch("http://localhost:4001/api/kategori");

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json = await res.json();

      if (Array.isArray(json)) {
        setKategoris(json);
        console.log("✅ Kategori loaded:", json);
      } else {
        console.error("❌ Format kategori tidak sesuai:", json);
        setKategoris([]);
      }
    } catch (err) {
      console.error("❌ Fetch kategori error:", err);
      setKategoris([]);
    }
  };

  // ============================
  // FETCH DATA RISET (PUBLIC)
  // ============================
  const fetchData = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (judul) params.append('judul', judul);
      if (nama) params.append('namaPeriset', nama);
      if (kategori) params.append('kategori', kategori);

      const res = await fetch(
        `http://localhost:4001/api/riset?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json = await res.json();

      if (json.success && json.data) {
        setData(
          json.data.map((item: RisetItem, index: number) => ({
            no: index + 1 + (currentPage - 1) * itemsPerPage,
            id: item.id,
            judul: item.judul,
            namaPeriset: item.nama_periset,
            kategoriRiset: item.nama_kategori,
            dokumen: item.dokumen_url,
            createdAt: item.created_at,
          }))
        );

        setTotalPages(json.pagination?.totalPages || 1);
        console.log("✅ Data loaded:", json.data.length, "riset");
      } else {
        setData([]);
        console.log("⚠️ No data found");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setData([]);
      alert('Gagal mengambil data riset! Pastikan backend running.');
    } finally {
      setLoading(false);
    }
  };

  // Load awal - fetch kategori dan data
  useEffect(() => {
    fetchKategoris();
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handleReset = () => {
    setJudul("");
    setNama("");
    setKategori("");
    setCurrentPage(1);
    // Will trigger fetchData through useEffect
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Navbar />

      <div
        className="min-h-screen flex flex-col bg-white py-4 sm:py-8"
        style={{ animation: "fadeIn 0.8s ease-in" }}
      >
        {/* Filter Section */}
        <div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
          style={{ animation: "slideDown 0.6s ease-out" }}
        >
          <div className="bg-[#1F4E73] text-white px-4 py-3 rounded-t-lg font-semibold text-center text-sm sm:text-base">
            Filter Pencarian
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-b-lg shadow-lg flex flex-col gap-3">
            {/* Filter inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Judul Riset"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm sm:text-base focus:ring-2 focus:ring-[#1F4E73] focus:outline-none"
              />

              <input
                type="text"
                placeholder="Nama Periset"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm sm:text-base focus:ring-2 focus:ring-[#1F4E73] focus:outline-none"
              />

              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm sm:text-base focus:ring-2 focus:ring-[#1F4E73] focus:outline-none"
              >
                <option value="">Semua Kategori</option>
                {kategoris.map((kat) => (
                  <option key={kat.kategori_id} value={kat.nama_kategori}>
                    {kat.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleReset}
                disabled={loading}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Reset
              </button>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-[#1F4E73] text-white px-6 py-2 rounded-lg hover:bg-[#163d5a] transition-all shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? 'Mencari...' : 'Cari'}
              </button>
            </div>

            {/* Active filters indicator */}
            {(judul || nama || kategori) && (
              <div className="flex gap-2 items-center text-sm flex-wrap pt-2 border-t">
                <span className="text-gray-600">Filter aktif:</span>
                {judul && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Judul: "{judul}"
                  </span>
                )}
                {nama && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    Periset: "{nama}"
                  </span>
                )}
                {kategori && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                    Kategori: {kategori}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div
          className="max-w-6xl mx-auto mt-4 sm:mt-6 px-4 sm:px-6 lg:px-8 w-full"
          style={{ animation: "slideUp 0.8s ease-out" }}
        >
          {/* Loading indicator */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E73]"></div>
              <p className="text-center py-4 text-gray-600 text-sm mt-2">
                Memuat data...
              </p>
            </div>
          )}

          {/* Desktop Table */}
          {!loading && (
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-lg">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-[#1F4E73] text-white">
                    <th className="p-3 w-12 text-center">No.</th>
                    <th className="p-3">Judul Riset</th>
                    <th className="p-3">Nama Periset</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Dokumen</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-center font-bold">{item.no}</td>
                        <td className="p-3">{item.judul}</td>
                        <td className="p-3">{item.namaPeriset}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {item.kategoriRiset}
                          </span>
                        </td>
                        <td className="p-3">
                          {item.dokumen ? (
                            <a
                              href={item.dokumen}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1F4E73] underline font-medium hover:text-[#163d5a]"
                            >
                              Lihat Dokumen
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        {(judul || nama || kategori) 
                          ? 'Tidak ada riset yang sesuai dengan kriteria pencarian'
                          : 'Belum ada data riset yang tersedia'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile Card */}
          <div className="md:hidden space-y-4">
            {!loading &&
              (data.length > 0 ? (
                data.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-lg p-4 border"
                  >
                    <div className="flex justify-between mb-3 border-b pb-2">
                      <span className="text-[#1F4E73] font-bold text-lg">
                        No. {item.no}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {item.kategoriRiset}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">Judul Riset</p>
                    <p className="text-sm font-medium mb-3">{item.judul}</p>

                    <p className="text-xs text-gray-500">Nama Periset</p>
                    <p className="text-sm mb-3">{item.namaPeriset}</p>

                    {item.dokumen && (
                      <a
                        href={item.dokumen}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center bg-[#1F4E73] text-white py-2 rounded-lg hover:bg-[#163d5a] transition-colors"
                      >
                        Lihat Dokumen
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <p className="text-gray-500 italic">
                    {(judul || nama || kategori) 
                      ? 'Tidak ada riset yang sesuai dengan kriteria pencarian'
                      : 'Belum ada data riset yang tersedia'}
                  </p>
                </div>
              ))}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center mt-5 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                    : "hover:bg-[#1F4E73] hover:text-white"
                }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    currentPage === p
                      ? "bg-[#1F4E73] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                    : "hover:bg-[#1F4E73] hover:text-white"
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* Info */}
          {!loading && data.length > 0 && (
            <div className="text-center mt-2 text-gray-600 text-xs">
              Menampilkan {startIndex + 1} – {startIndex + data.length} dari{" "}
              {totalPages * itemsPerPage} total riset
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}