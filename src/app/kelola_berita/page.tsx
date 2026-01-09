'use client';

import React, { useEffect, useState } from 'react';
import SidebarAdmin from '@/components/ui/sidebar_admin';

// ---------------- Types ----------------
type Status = 'draft' | 'publik';

interface Berita {
  id: number;
  judul: string;
  isi: string;
  thumbnail: string;
  status: Status;
  link: string; 
  tanggal_dibuat?: string;
  penulis?: string | null;
}

// ---------------- Config ----------------
const API_URL = 'http://localhost:4001/api/berita';

const statusConfig: Record<Status, { label: string; className: string }> = {
  publik: { label: 'Publik', className: 'bg-green-100 text-green-800 border-green-300' },
  draft: { label: 'Draft', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
};

// ---------------- Helpers ----------------
const parseResponseData = (resJson: any) => {
  if (!resJson) return null;
  if (Array.isArray(resJson)) return resJson;
  if (Array.isArray(resJson.data)) return resJson.data;
  if (resJson.data && (Array.isArray(resJson.data) || typeof resJson.data === 'object')) return resJson.data;
  return resJson;
};

const normalizeThumbnail = (item: any) => {
  if (!item) return item;
  if (item.thumbnail && typeof item.thumbnail === 'string' && !item.thumbnail.startsWith('http')) {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    item.thumbnail = item.thumbnail.startsWith('/') ? `${base}${item.thumbnail}` : `${base}/${item.thumbnail}`;
  }
  return item;
};

// ---------------- Main Page ----------------
export default function KelolaBeritaPage() {
  const [beritaData, setBeritaData] = useState<Berita[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Status>('all');

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBerita, setEditingBerita] = useState<Berita | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingBerita, setViewingBerita] = useState<Berita | null>(null);

  // form state
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [status, setStatus] = useState<Status>('draft');
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  // fetch
  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        const parsed = parseResponseData(json);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((p: any) => normalizeThumbnail(p));
          setBeritaData(normalized);
        } else {
          setBeritaData([]);
        }
      } catch (err) {
        console.error('Gagal fetch berita:', err);
        setBeritaData([]);
      }
    };
    fetchBerita();
  }, []);

  // filter + search
  const filtered = beritaData.filter((b) => {
    const matchesSearch = searchTerm.trim() === '' || b.judul.toLowerCase().includes(searchTerm.toLowerCase()) || b.isi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // reset form
  const resetForm = () => {
    setJudul('');
    setIsi('');
    setStatus('draft');
    setLink('');
    setFile(null);
    setPreview('');
    setEditingBerita(null);
  };

  // open handlers
  const openAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (b: Berita) => {
    setJudul(b.judul ?? '');
    setIsi(b.isi ?? '');
    setStatus(b.status ?? 'draft');
    setLink(b.link ?? '');
    setFile(null);
    setPreview(b.thumbnail ?? '');
    setEditingBerita(b);
    setIsModalOpen(true);
  };

  const openView = (b: Berita) => {
    setViewingBerita(b);
    setIsViewOpen(true);
  };

  // file upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(editingBerita?.thumbnail ?? '');
    }
  };

  // submit handler
  const handleSubmit = async () => {
    if (!judul.trim() || !isi.trim() || !link.trim()) {
      alert('Judul, isi, dan link wajib diisi');
      return;
    }

    const form = new FormData();
    form.append('judul', judul.trim());
    form.append('isi', isi.trim());
    form.append('status', status);
    form.append('link', link.trim());
    if (file instanceof File) form.append('thumbnail', file);

    try {
      const url = editingBerita ? `${API_URL}/${editingBerita.id}` : API_URL;
      const method = editingBerita ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: form });
      const json = await res.json();
      const saved = json?.data ?? json;
      normalizeThumbnail(saved);

      if (editingBerita) {
        setBeritaData(prev => prev.map(b => (b.id === editingBerita.id ? saved : b)));
      } else {
        setBeritaData(prev => [saved, ...prev]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Gagal menyimpan berita:', err);
      alert('Gagal menyimpan berita. Cek console.');
    }
  };

  // delete
  const deleteBerita = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setBeritaData(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Gagal hapus berita:', err);
      alert('Gagal menghapus berita. Cek console.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
        <SidebarAdmin />
    
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">📰 Kelola Berita</h1>
            <p className="text-gray-600 mt-2">Kelola dan publikasikan berita terbaru</p>
          </div>

          {/* Filter & Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari berita berdasarkan judul atau isi..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F4E73] focus:outline-none transition-colors"
                />
              </div>

              {/* Filter Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F4E73] focus:outline-none transition-colors font-medium"
              >
                <option value="all">Semua Status</option>
                <option value="publik">Publis</option>
                <option value="draft">Draft</option>
              </select>

              {/* Tombol Tambah */}
              <button
                onClick={openAdd}
                className="bg-[#1F4E73] hover:bg-[#163a56] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Tambah Berita</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📭</span>
              </div>
              <p className="text-gray-500 font-medium text-lg">Tidak ada berita ditemukan</p>
              <p className="text-gray-400 text-sm mt-1">Coba ubah filter atau tambahkan berita baru</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {b.thumbnail ? (
                      <img src={b.thumbnail} alt={b.judul} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-6xl">📰</span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border-2 ${statusConfig[b.status].className} shadow-sm backdrop-blur-sm bg-white/90`}>
                        {statusConfig[b.status].label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-[#1F4E73] transition-colors">
                      {b.judul}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{b.isi}</p>

                    {/* Link */}
                    {b.link && (
                      <a
                        href={b.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-[#1F4E73] hover:text-[#163a56] font-medium mb-3 group"
                      >
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Baca Berita Asli
                      </a>
                    )}

                    {/* Tanggal */}
                    <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {b.tanggal_dibuat ? new Date(b.tanggal_dibuat).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => openView(b)}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-200 transition-colors"
                      >
                        Lihat
                      </button>
                      <button
                        onClick={() => openEdit(b)}
                        className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm font-semibold border border-yellow-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteBerita(b.id)}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold border border-red-200 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingBerita ? '✏️ Edit Berita' : '➕ Tambah Berita Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Judul */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Judul Berita <span className="text-red-500">*</span>
                </label>
                <input
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F4E73] focus:outline-none transition-colors"
                  placeholder="Masukkan judul berita..."
                />
              </div>

              {/* Isi */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Isi Berita <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F4E73] focus:outline-none transition-colors resize-none"
                  placeholder="Tulis isi berita..."
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Link Berita Asli <span className="text-red-500">*</span>
                </label>
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F4E73] focus:outline-none transition-colors"
                  placeholder="https://detik.com/berita/..."
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F4E73] focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1F4E73] file:text-white file:cursor-pointer hover:file:bg-[#163a56]"
                />
                {preview && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
                    <img src={preview} alt="preview" className="w-full max-w-md h-48 object-cover rounded-xl border-2 border-gray-200" />
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1F4E73] focus:outline-none transition-colors font-medium"
                >
                  <option value="draft">Draft</option>
                  <option value="publik">Publis</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-[#1F4E73] hover:bg-[#163a56] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  {editingBerita ? '💾 Update' : '📤 Publikasikan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal View */}
      {isViewOpen && viewingBerita && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Thumbnail Header */}
            <div className="relative">
              {viewingBerita.thumbnail ? (
                <img src={viewingBerita.thumbnail} alt={viewingBerita.judul} className="w-full h-64 md:h-80 object-cover" />
              ) : (
                <div className="w-full h-64 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-8xl">📰</span>
                </div>
              )}
              <button
                onClick={() => setIsViewOpen(false)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-xl hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-4">
              {/* Status Badge */}
              <div>
                <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold border-2 ${statusConfig[viewingBerita.status].className}`}>
                  {statusConfig[viewingBerita.status].label}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{viewingBerita.judul}</h1>

              {/* Meta Info */}
              <div className="flex items-center text-sm text-gray-500 gap-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{viewingBerita.tanggal_dibuat ? new Date(viewingBerita.tanggal_dibuat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
                </div>
                {viewingBerita.penulis && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{viewingBerita.penulis}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Body */}
              <div className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {viewingBerita.isi}
              </div>

              {/* Link */}
              {viewingBerita.link && (
                <div className="pt-4 border-t border-gray-200">
                  <a
                    href={viewingBerita.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#1F4E73] hover:text-[#163a56] font-semibold group"
                  >
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Baca Berita Lengkap di Sumber Asli
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}