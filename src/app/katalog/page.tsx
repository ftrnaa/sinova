"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import {
  Search,
  X,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";

/* ================== TYPES ================== */
interface Inovasi {
  id: number;
  title: string;
  desc: string;
  images: string[];
  harga: string;
  kategori: string;
  penyedia: string;
  telp: string;
  status?: string;
}

interface Kategori {
  kategori_id: number;
  nama_kategori: string;
}

/* ================== CONSTANTS ================== */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

/* ================== PAGE ================== */
export default function KatalogPage() {
  const router = useRouter();
  const [inovasiList, setInovasiList] = useState<Inovasi[]>([]);
  const [categories, setCategories] = useState<Kategori[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Inovasi | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* ================== CHECK AUTH ================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  /* ================== FETCH CATEGORIES ================== */
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/kategori`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("KATEGORI DARI API:", data);
      setCategories(data);
    } catch (err) {
      console.error("Gagal fetch kategori:", err);
    }
  };

  /* ================== FETCH PRODUK ================== */
  const fetchInovasi = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (selectedCategory) params.append("kategori", selectedCategory);

    try {
      const res = await fetch(`${API_BASE_URL}/api/public/produk/katalog?${params}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("DATA PRODUK:", data);

      const mapped: Inovasi[] = data.map((item: any) => {
        // Ambil foto utama atau foto pertama dari foto_list
        let mainImage = '';
        if (item.foto_produk) {
          mainImage = `${API_BASE_URL}/${item.foto_produk.replace(/\\/g, "/")}`;
        } else if (item.foto_list && item.foto_list.length > 0) {
          mainImage = `${API_BASE_URL}/${item.foto_list[0].path.replace(/\\/g, "/")}`;
        }

        // Ambil semua foto dari foto_list
        const allImages = item.foto_list && item.foto_list.length > 0
          ? item.foto_list.map((f: any) => `${API_BASE_URL}/${f.path.replace(/\\/g, "/")}`)
          : [mainImage];

        return {
          id: item.id,
          title: item.nama_produk,
          desc: item.deskripsi,
          images: allImages.filter(Boolean),
          harga: `Rp ${Number(item.harga).toLocaleString("id-ID")}`,
          kategori: item.nama_kategori || 'Tanpa Kategori',
          penyedia: item.penyedia_name || `User #${item.user_id}`,
          telp: item.kontak,
        };
      });

      setInovasiList(mapped);
    } catch (err: any) {
      console.error("Error fetching produk:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchInovasi, 500);
    return () => clearTimeout(t);
  }, [fetchInovasi]);

  /* ================== HANDLE CARD CLICK ================== */
  const handleCardClick = (item: Inovasi) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setSelected(item);
      setCurrentImageIndex(0);
    }
  };

  /* ================== RENDER ================== */
  return (
    <main className="min-h-screen bg-[#F3F7FB] flex flex-col pt-2">
      {/* NAVBAR */}
      <Navbar />

      {/* ================== HEADER ================== */}
      <header className="bg-[#F3F7FB] border-b-4 border-[#1F4E73]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-center text-[#1F4E73]">
            Katalog Inovasi Terverifikasi
          </h1>
          <p className="text-center text-gray-600 mt-2 mb-6">
            Temukan inovasi terbaik dengan tampilan marketplace
          </p>

          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3">
            {/* SEARCH */}
            <div className="flex-1 flex items-center bg-white border rounded-lg px-4 py-3">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                className="flex-1 outline-none"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")}>
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* FILTER */}
            <select
              className="bg-white border rounded-lg px-4 py-3"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.kategori_id} value={cat.nama_kategori}>
                  {cat.nama_kategori}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* ================== CONTENT ================== */}
      <section className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <p className="text-center text-[#1F4E73]">Memuat produk...</p>
          )}

          {error && (
            <p className="text-center text-red-500">Error: {error}</p>
          )}

          {!loading && inovasiList.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-lg">Produk tidak ditemukan</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {inovasiList.map((item) => (
             <div
             key={item.id}
             onClick={() => handleCardClick(item)}
             className="bg-white rounded-lg shadow hover:shadow-lg cursor-pointer transition-all relative group
                        flex flex-col h-full"
           >
           
                {item.images.length > 0 && item.images[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="aspect-square object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                    <span className="text-5xl">📦</span>
                  </div>
                )}
                
                {/* Lock overlay for non-authenticated users */}
                {!isAuthenticated && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all rounded-t-lg flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white opacity-0 group-hover:opacity-70 transition-all" />
                  </div>
                )}
                
                <div className="p-3 flex flex-col flex-1">
  <h3 className="text-sm font-medium line-clamp-2 mb-2">
    {item.title}
  </h3>

  {/* PRICE — selalu di bawah */}
  <p className="text-[#1F4E73] font-bold mt-auto">
    {item.harga}
  </p>
</div>

              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* ================== AUTH REQUIRED MODAL ================== */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-[#1F4E73]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-[#1F4E73]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Login Diperlukan
                </h2>
                <p className="text-gray-600 mb-6">
                  Anda perlu login terlebih dahulu untuk melihat detail produk dan menghubungi penjual.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => router.push('/login')}
                    className="flex-1 bg-[#1F4E73] text-white py-3 rounded-lg font-medium hover:bg-[#163A56] transition-all"
                  >
                    Login Sekarang
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================== MODAL DETAIL ================== */}
      <AnimatePresence>
        {selected && isAuthenticated && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <div className="min-h-screen flex items-start sm:items-center justify-center p-2 sm:p-4">
              <motion.div
                className="bg-white rounded-xl sm:rounded-2xl w-full max-w-5xl my-4 sm:my-8 shadow-2xl overflow-hidden"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-2 top-2 sm:right-4 sm:top-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg z-10 transition-all"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
                  {/* Image Section */}
                  <div className="space-y-3">
                    {/* Main Image */}
                    <div className="bg-gray-50 rounded-xl overflow-hidden aspect-square flex items-center justify-center relative group">
                      {selected.images.length > 0 && selected.images[currentImageIndex] ? (
                        <img
                          src={selected.images[currentImageIndex]}
                          alt={selected.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-8xl">📦</div>
                      )}

                      {/* Navigation Arrows */}
                      {selected.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex((prev) =>
                                prev === 0 ? selected.images.length - 1 : prev - 1
                              );
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex((prev) =>
                                prev === selected.images.length - 1 ? 0 : prev + 1
                              );
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      {selected.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                          {currentImageIndex + 1}/{selected.images.length}
                        </div>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {selected.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selected.images.map((img, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(i);
                            }}
                            className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              currentImageIndex === i
                                ? "border-[#1F4E73] ring-2 ring-[#1F4E73]/30"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Details Section */}
                  <div className="space-y-4 overflow-y-auto max-h-[70vh]">
                    {/* Category Badge */}
                    <div>
                      <span className="inline-block bg-[#1F4E73]/10 text-[#1F4E73] text-xs px-3 py-1 rounded-full font-medium">
                        {selected.kategori}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
                      {selected.title}
                    </h2>

                    {/* Price */}
                    <div className="bg-[#1F4E73]/5 border-l-4 border-[#1F4E73] rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Harga Produk</p>
                      <p className="text-2xl sm:text-3xl font-bold text-[#1F4E73]">
                        {selected.harga}
                      </p>
                    </div>

                    {/* Description */}
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                        Detail Produk
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {selected.desc}
                      </p>
                    </div>

                    {/* Seller Info */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base flex items-center gap-2">
                        <span className="w-8 h-8 bg-[#1F4E73] rounded-full flex items-center justify-center text-white text-xs">
                          {selected.penyedia.charAt(0)}
                        </span>
                        Informasi Penjual
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Nama penyedia</span>
                          <span className="font-medium text-gray-800">
                            {selected.penyedia}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Kontak</span>
                          <span className="font-medium text-gray-800">
                            {selected.telp}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="sticky bottom-0 bg-white pt-4 pb-2 flex gap-3">
                      <a
                        href={`tel:${selected.telp}`}
                        className="flex-1 bg-white border-2 border-[#1F4E73] text-[#1F4E73] py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#1F4E73]/5 transition-all text-sm sm:text-base"
                      >
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                        Telepon 
                      </a>
                      <a
                        href={`https://wa.me/${selected.telp.replace(/^0/, "62")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-white border-2 border-[#1F4E73] text-[#1F4E73] py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#1F4E73]/5 transition-all text-sm sm:text-base"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        Chat WA
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}