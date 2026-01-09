"use client";

import { useState, useEffect, useMemo } from 'react';
import SidebarPenyedia from '@/components/ui/sidebar_penyedia';

const API_URL = "http://localhost:4001/api/riset";
const KATEGORI_API_URL = "http://localhost:4001/api/kategori";

interface Riset {
  id: string;
  judul: string;
  nama_periset: string;
  nama_kategori: string;
  dokumen_url: string;
  created_at: string;
}

interface Kategori {
  kategori_id: number;
  nama_kategori: string;
}

export default function ResearchManagement() {
  const [data, setData] = useState<Riset[]>([]);
  const [kategoris, setKategoris] = useState<Kategori[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');

  const [formData, setFormData] = useState({
    id: "",
    judul: "",
    namaPeriset: "",
    kategoriId: "",
    dokumenUrl: ""
  });

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Filtered data based on search - REAL TIME
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by kategori dropdown
    if (selectedKategori) {
      result = result.filter(item => item.nama_kategori === selectedKategori);
    }

    // Filter by search term - SEARCH ALL FIELDS
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item => {
        return (
          item.judul.toLowerCase().includes(searchLower) ||
          item.nama_periset.toLowerCase().includes(searchLower) ||
          item.nama_kategori.toLowerCase().includes(searchLower)
        );
      });
    }

    return result;
  }, [data, searchTerm, selectedKategori]);

  // FETCH KATEGORI dari Backend API
  const fetchKategoris = async () => {
  try {
    const res = await fetch(KATEGORI_API_URL);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    // ✅ Backend return array langsung
    if (Array.isArray(json)) {
      setKategoris(json);
      console.log('✅ Kategori berhasil dimuat:', json);
    } else {
      console.error('❌ Format response tidak sesuai:', json);
      setKategoris([]);
    }
  } catch (err) {
    console.error("❌ Fetch kategori error:", err);
    alert('Gagal mengambil data kategori! Pastikan backend running.');
    setKategoris([]);
  }
};


  // FETCH MY DATA (User's own research)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        alert('Anda harus login terlebih dahulu!');
        return;
      }

      const res = await fetch(`${API_URL}/my?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      if (json.success && json.data) {
        setData(json.data);
        
        if (json.pagination) {
          setTotalPages(json.pagination.totalPages || 1);
        }
      } else {
        setData([]);
      }
      
    } catch (err) {
      console.error("Fetch error:", err);
      alert('Gagal mengambil data! Pastikan backend running dan Anda sudah login.');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKategoris(); // Load kategori dari database
    fetchData();
  }, [page]);

  // OPEN MODAL
  const openAddModal = () => {
    setIsEdit(false);
    setFormData({ id: "", judul: "", namaPeriset: "", kategoriId: "", dokumenUrl: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Riset) => {
    setIsEdit(true);
    const kategori = kategoris.find(k => k.nama_kategori === item.nama_kategori);
    setFormData({
      id: item.id,
      judul: item.judul,
      namaPeriset: item.nama_periset,
      kategoriId: kategori ? kategori.kategori_id.toString() : "",
      dokumenUrl: item.dokumen_url
    });
    setIsModalOpen(true);
  };

  // CREATE
  const handleCreate = async () => {
    if (!formData.judul || !formData.namaPeriset || !formData.kategoriId || !formData.dokumenUrl) {
      alert('Semua field harus diisi!');
      return;
    }

    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        alert('Anda harus login terlebih dahulu!');
        return;
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          judul: formData.judul,
          namaPeriset: formData.namaPeriset,
          kategoriId: Number(formData.kategoriId),
          dokumenUrl: formData.dokumenUrl
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      if (json.success) {
        alert('Data berhasil ditambahkan!');
        setIsModalOpen(false);
        setFormData({ id: "", judul: "", namaPeriset: "", kategoriId: "", dokumenUrl: "" });
        fetchData();
      } else {
        alert(json.message || 'Gagal menambahkan data!');
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('Gagal menambahkan data!');
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    if (!formData.judul || !formData.namaPeriset || !formData.kategoriId || !formData.dokumenUrl) {
      alert('Semua field harus diisi!');
      return;
    }

    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        alert('Anda harus login terlebih dahulu!');
        return;
      }

      const res = await fetch(`${API_URL}/${formData.id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          judul: formData.judul,
          namaPeriset: formData.namaPeriset,
          kategoriId: Number(formData.kategoriId),
          dokumenUrl: formData.dokumenUrl
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      if (json.success) {
        alert('Data berhasil diupdate!');
        setIsModalOpen(false);
        setFormData({ id: "", judul: "", namaPeriset: "", kategoriId: "", dokumenUrl: "" });
        fetchData();
      } else {
        alert(json.message || 'Gagal mengupdate data!');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Gagal mengupdate data!');
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        alert('Anda harus login terlebih dahulu!');
        return;
      }

      const res = await fetch(`${API_URL}/${id}`, { 
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      
      if (json.success) {
        alert('Data berhasil dihapus!');
        fetchData();
      } else {
        alert(json.message || 'Gagal menghapus data!');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Gagal menghapus data!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <SidebarPenyedia />

      <div className="flex-1 min-h-screen">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#1F4E73] to-[#3e81aa] text-white py-8 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Kelola Hasil Riset</h1>
            <p className="text-blue-100 text-sm mt-1">
              Selamat datang, Penyedia! Kelola hasil riset Anda di sini
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="container mx-auto px-4 py-8">
          {/* FILTER COMPONENT */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter & Pencarian</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kategori Dropdown - Dari Database */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Berdasarkan Kategori
                </label>
                <select
                  value={selectedKategori}
                  onChange={(e) => setSelectedKategori(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Semua Kategori</option>
                  {kategoris.map((kat) => (
                    <option key={kat.kategori_id} value={kat.nama_kategori}>
                      {kat.nama_kategori}
                    </option>
                  ))}
                </select>
                {kategoris.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ Tidak ada kategori. Pastikan backend running!
                  </p>
                )}
              </div>

              {/* Search Input - REAL TIME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari (Judul, Periset, atau Kategori)
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ketik untuk mencari..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Show active filters */}
            {(searchTerm || selectedKategori) && (
              <div className="mt-4 flex gap-2 items-center text-sm flex-wrap">
                <span className="text-gray-600">Filter aktif:</span>
                {searchTerm && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Pencarian: "{searchTerm}"
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedKategori && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    Kategori: {selectedKategori}
                    <button 
                      onClick={() => setSelectedKategori('')}
                      className="ml-2 text-green-600 hover:text-green-800 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* HEADER TABLE */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Manajemen Data Riset 
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({filteredData.length} dari {data.length} data)
              </span>
            </h2>
            <button
              onClick={openAddModal}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              + Tambah Riset
            </button>
          </div>

          {/* LOADING */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}

          {/* TABLE */}
          {!isLoading && (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left font-semibold text-gray-700">Judul</th>
                    <th className="p-3 text-left font-semibold text-gray-700">Periset</th>
                    <th className="p-3 text-left font-semibold text-gray-700">Kategori</th>
                    <th className="p-3 text-left font-semibold text-gray-700">Link Dokumen</th>
                    <th className="p-3 text-center font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        {searchTerm || selectedKategori 
                          ? 'Tidak ada data yang sesuai dengan pencarian' 
                          : 'Tidak ada data riset'}
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="p-3">{item.judul}</td>
                        <td className="p-3">{item.nama_periset}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {item.nama_kategori}
                          </span>
                        </td>
                        <td className="p-3">
                          {item.dokumen_url ? (
                            <a
                              href={item.dokumen_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline hover:text-blue-800 break-all"
                            >
                              {item.dokumen_url.length > 40 
                                ? item.dokumen_url.substring(0, 40) + '...' 
                                : item.dokumen_url}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => openEditModal(item)}
                              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          <div className="flex justify-center mt-6 gap-2 items-center">
            <button
              disabled={page === 1 || isLoading}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 border rounded disabled:bg-gray-200 hover:bg-gray-100 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 text-gray-700">
              Halaman {page} dari {totalPages}
            </span>
            <button
              disabled={page === totalPages || isLoading}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 border rounded disabled:bg-gray-200 hover:bg-gray-100 transition-colors"
            >
              Next
            </button>
          </div>

          {/* MODAL */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  {isEdit ? "Edit Riset" : "Tambah Riset"}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Judul <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.judul}
                      onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                      className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan judul riset"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Nama Periset <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.namaPeriset}
                      onChange={(e) => setFormData({ ...formData, namaPeriset: e.target.value })}
                      className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan nama periset"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.kategoriId}
                      onChange={(e) => setFormData({ ...formData, kategoriId: e.target.value })}
                      className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Pilih Kategori</option>
                      {kategoris.map((kat) => (
                        <option key={kat.kategori_id} value={kat.kategori_id}>
                          {kat.nama_kategori}
                        </option>
                      ))}
                    </select>
                    {kategoris.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        ⚠️ Tidak ada kategori tersedia
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Link Dokumen <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={formData.dokumenUrl}
                      onChange={(e) => setFormData({ ...formData, dokumenUrl: e.target.value })}
                      className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/dokumen.pdf"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Masukkan URL/link lengkap ke dokumen PDF
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button 
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormData({ id: "", judul: "", namaPeriset: "", kategoriId: "", dokumenUrl: "" });
                    }}
                    disabled={isLoading}
                    className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors disabled:bg-gray-200"
                  >
                    Batal
                  </button>
                  <button
                    onClick={isEdit ? handleUpdate : handleCreate}
                    disabled={isLoading || kategoris.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isLoading ? 'Loading...' : (isEdit ? "Update" : "Simpan")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}