"use client";

import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Image from 'next/image';
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaLightbulb, FaHandPointRight, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

interface Berita {
  id: number;
  judul: string;
  isi: string;
  thumbnail: string;
  link: string;
  status: "draft" | "publik";
  tanggal_dibuat: string;
}

interface Stats {
  total: number;
  diverifikasi: number;
}

export default function Beranda() {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const res = await fetch("http://localhost:4001/api/berita");
        const json = await res.json();
        let list = Array.isArray(json.data) ? json.data : json.data ? [json.data] : [];
        setBerita(list.slice(0, 6));
      } catch (error) {
        console.error("Gagal load berita:", error);
        setBerita([]);
      }
    };
    fetchBerita();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:4001/api/beranda/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Gagal load stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-[#F3F7FB] min-h-screen text-[#1F4E73]">
      <Navbar />

      {/* Banner */}
      <section className="relative w-full">
        <Image
          src="/baner.jpg"
          alt="Banner SINOVA"
          width={1200}
          height={400}
          className="w-full object-cover"
        />
      </section>

      {/* Fitur Kami */}
      <section className="container mx-auto py-20 px-8">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-3 text-[#1F4E73]">Fitur Kami</h3>
          <p className="text-gray-600 text-lg">
            Jelajahi berbagai fitur unggulan kami untuk mendukung kegiatan penelitian dan inovasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/katalog">
            <div className="cursor-pointer bg-[#2D6A9E] text-white rounded-3xl p-8 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="bg-white/20 rounded-full p-6 mb-6 transition-transform">
                <FaLightbulb className="text-white text-4xl" />
              </div>
              <h4 className="text-xl font-bold mb-4">Katalog Produk</h4>
              <p className="text-sm leading-relaxed text-white/90">
                Jelajahi berbagai produk inovatif hasil penelitian dan pengembangan daerah.
              </p>
            </div>
          </Link>

          <Link href="/layanan">
            <div className="cursor-pointer bg-[#2D6A9E] text-white rounded-3xl p-8 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="bg-white/20 rounded-full p-6 mb-6 transition-transform">
                <FaHandPointRight className="text-white text-4xl" />
              </div>
              <h4 className="text-xl font-bold mb-4">Usulan Kebutuhan Produk Inovasi</h4>
              <p className="text-sm leading-relaxed text-white/90">
                Ajukan ide dan kebutuhan produk inovatif untuk kemajuan daerah bersama kami.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Berita */}
      <section className="container mx-auto py-20 px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1F4E73] mb-3">
            Berita Terkini
          </h2>
          <p className="text-gray-600">
            Update terbaru seputar inovasi dan riset daerah
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {berita.length > 0 ? (
            berita.filter(item => item.status === "publik").map((item, i) => (
              <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-[#2D6A9E] text-white px-4 py-1 rounded-full text-xs font-semibold">
                      Berita
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(item.tanggal_dibuat).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    <h3 className="text-lg font-bold text-[#1F4E73] mb-3 group-hover:text-[#2D6A9E] transition-colors">
                      {item.judul}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.isi}
                    </p>

                    <span className="inline-flex items-center text-sm font-semibold text-[#2D6A9E] group-hover:underline">
                      Baca selengkapnya →
                    </span>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-3">Belum ada berita.</p>
          )}
        </div>
      </section>

      {/* Riset & Inovasi */}
      <section className="bg-[#F3F7FB] py-20 px-8 text-[#1F4E73]">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">RISET DAN INOVASI DAERAH</h2>
          <p className="text-center text-gray-600 mb-12 text-xl">KEPULAUAN RIAU</p>

          <div className="flex flex-col lg:flex-row justify-center items-center gap-12">
            <div className="relative">
              <Image
                src="/ilustrasi-riset.png"
                alt="Ilustrasi riset dan inovasi"
                width={450}
                height={400}
                className="rounded-3xl shadow-xl"
              />
            </div>

            <div className="max-w-2xl">
              <h3 className="text-3xl font-bold mb-4">INOVASI & RISET</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Inovasi adalah proses menghadirkan ide baru yang memberi manfaat nyata bagi masyarakat dan daerah. 
                Tujuannya untuk memecahkan masalah, meningkatkan kualitas hidup, serta memperkuat daya saing.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                {['Pendidikan','Kesehatan','Lingkungan','Transportasi','Pariwisata','Perikanan','Industri Kreatif'].map((item, i) => (
                  <div key={i} className="bg-[#2D6A9E] text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all cursor-pointer">
                    {item}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-8 text-center border border-blue-100 shadow-sm">
                  <p className="text-4xl font-bold mb-2">{stats ? stats.total : 0}</p>
                  <p className="text-sm text-gray-600">Total Produk</p>
                </div>
                <div className="bg-white rounded-2xl p-8 text-center border border-blue-100 shadow-sm">
                  <p className="text-4xl font-bold mb-2">{stats ? stats.diverifikasi : 0}</p>
                  <p className="text-sm text-gray-600">Diverifikasi</p>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hubungi Kami */}
      <section className="container mx-auto py-20 px-8">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-3 text-[#1F4E73]">Hubungi Kami</h3>
          <p className="text-gray-600 text-lg">Jika ada pertanyaan, jangan ragu untuk menghubungi kami</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#2D6A9E] text-white rounded-3xl p-8 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="bg-white/20 rounded-full p-6 mb-6">
              <FaMapMarkerAlt className="text-white text-4xl" />
            </div>
            <h4 className="text-xl font-bold mb-4">Alamat</h4>
            <p className="text-sm leading-relaxed text-white/90">
              Gedung Sultan Mahmud Riayat Syah Gedung L lantai I dan IV, Kompleks
              Perkantoran Pemerintah Provinsi Kepulauan Riau, Dompak, Bukit Bestari,
              Kota Tanjung Pinang, Kepulauan Riau, Indonesia
            </p>
          </div>

          <div className="bg-[#2D6A9E] text-white rounded-3xl p-8 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="bg-white/20 rounded-full p-6 mb-6">
              <FaEnvelope className="text-white text-4xl" />
            </div>
            <h4 className="text-xl font-bold mb-4">Email</h4>
            <p className="text-sm text-white/90">bappeda@batam.go.id</p>
          </div>

          <div className="bg-[#2D6A9E] text-white rounded-3xl p-8 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="bg-white/20 rounded-full p-6 mb-6">
              <FaPhoneAlt className="text-white text-4xl" />
            </div>
            <h4 className="text-xl font-bold mb-4">Telepon</h4>
            <p className="text-sm text-white/90">0778-463045</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
