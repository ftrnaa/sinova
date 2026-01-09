// src/app/dashboard/page.tsx
"use client";

import Sidebar from "../../components/ui/sidebar";
import StatItem from "../../components/ui/statitem";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const stats = [
    { title: "Aplikasi Manajemen Sampah", status: "Sedang Diproses" },
    { title: "Platform Edukasi", status: "Sudah Terverifikasi" },
    { title: "Sistem Monitoring Air", status: "Sedang Diproses" },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">Dashboard Penyedia</h2>
              <p className="text-sm text-gray-500">Ringkasan & statistik inovasi</p>
            </div>

            <div className="bg-white px-4 py-2 rounded-md shadow-sm">
              <div className="text-sm text-sky-600 font-semibold">Kelola Produk</div>
              <div className="text-lg font-bold text-slate-800">12</div>
            </div>
          </div>
        </motion.header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Statistik list (ambil 2 kolom lebar) */}
          <section className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Statistik</h3>

              {/* list inovasi */}
              <div>
                {stats.map((s, i) => (
                  <StatItem key={i} title={s.title} status={s.status} delay={i * 0.08} />
                ))}
              </div>
            </div>
          </section>

          {/* Right: ringkasan singkat */}
          <aside className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-semibold text-slate-700 mb-3">Ringkasan</h4>
            <ul className="text-sm text-gray-600 space-y-3">
              <li>Jumlah produk: <strong className="text-slate-800">12</strong></li>
              <li>Permintaan baru: <strong className="text-slate-800">4</strong></li>
              <li>Verifikasi pending: <strong className="text-slate-800">3</strong></li>
            </ul>
          </aside>
        </div>

        {/* Footer kecil di bawah konten */}
        <footer className="mt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} SINOVA KEPRI — Sistem Riset dan Inovasi Daerah
        </footer>
      </main>
    </div>
  );
}
