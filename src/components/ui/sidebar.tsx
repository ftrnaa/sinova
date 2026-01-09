// src/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Sidebar() {
  const items = [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    { name: "Katalog Produk", href: "/katalog", icon: "📦" },
    { name: "Usulan Kebutuhan", href: "/usulan", icon: "📝" },
    { name: "Profile", href: "/profile", icon: "👤" },
  ];

  return (
    <aside className="w-72 bg-[#1F4E73] text-white flex-shrink-0 min-h-screen shadow-lg">
      <div className="px-6 py-6 flex items-center gap-3 border-b border-teal-700">
        <div className="w-12 h-12 rounded-md bg-white/10 flex items-center justify-center">
          {/* tempat logo */}
          <img src="/logo.png" alt="logo" className="w-8 h-8" />
        </div>
        <div>
          <h1 className="font-bold text-lg">SINOVA</h1>
          <p className="text-xs text-white">Sistem Informasi dan Inovasi Riset Daerah</p>
        </div>
      </div>

      <nav className="px-4 py-6">
        {items.map((it, idx) => (
          <motion.div
            key={it.href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="mb-2"
          >
            <Link
              href={it.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-teal-700/60 transition-colors"
            >
              <span className="text-lg">{it.icon}</span>
              <span className="font-medium">{it.name}</span>
            </Link>
          </motion.div>
        ))}
      </nav>

      <div className="px-4 mt-auto pb-8">
        <button className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-md transition">
          Logout
        </button>
      </div>
    </aside>
  );
}
