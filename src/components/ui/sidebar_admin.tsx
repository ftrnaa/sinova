"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Home,
  Package,
  User,
  LogOut,
  Menu,
  X,
  Lightbulb,
  FileText,
} from "lucide-react";

const SidebarAdmin = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<{ name: string; foto?: string } | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  const router = useRouter();

  // ================= SET ACTIVE MENU =================
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveMenu(window.location.pathname);
    }
  }, []);

  // ================= FETCH ADMIN =================
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const res = await fetch(`${API_URL}/auth/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser({ name: data.name, foto: data.foto_profil });
      } catch {
        setUser({ name: "Admin Utama" });
      }
    };

    fetchAdmin();
  }, []);

  // ================= SIDEBAR WIDTH =================
  useEffect(() => {
    const setWidth = () => {
      const isDesktop = window.innerWidth >= 768;
      let width = "16rem";
      if (!isOpen) width = isDesktop ? "5rem" : "0px";
      document.documentElement.style.setProperty("--sidebar-width", width);
    };

    setWidth();
    window.addEventListener("resize", setWidth);
    return () => window.removeEventListener("resize", setWidth);
  }, [isOpen]);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    router.replace("/");
  };

  const menuItems = [
    { href: "/dashboard_admin", icon: Home, label: "Dashboard" },
    { href: "/katalogproduk_admin", icon: Package, label: "Katalog Produk" },
    { href: "/usulanKebutuhanAdmin", icon: Lightbulb, label: "Usulan Kebutuhan" },
    { href: "/kelola_berita", icon: FileText, label: "Kelola Berita" },
    { href: "/laporan_admin", icon: FileText, label: "Laporan" },
    { href: "/edit-profil", icon: User, label: "Profil" },
  ];

  return (
    <>
      <div className="flex h-screen">
        {/* MOBILE TOGGLE */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="p-3 bg-gradient-to-br from-[#1F4E73] to-[#2d5f8d] text-white fixed top-4 left-4 z-50 rounded-xl md:hidden"
          >
            <Menu size={20} />
          </button>
        )}

        {/* SIDEBAR */}
        <aside
          className={`fixed md:static z-40 h-screen bg-gradient-to-b from-[#1F4E73] to-[#163952] text-white transition-all duration-300
          ${isOpen ? "w-64" : "w-0 md:w-20"} overflow-hidden`}
        >
          {/* HEADER */}
          <div className={`relative p-6 border-b border-white/10 ${!isOpen && "md:p-4"}`}>
            {isOpen ? (
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo sinova.jpeg"
                    alt="SINOVA Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>

                <div>
                  <h1 className="text-xl font-bold">SINOVA</h1>
                  <p className="text-[10px] text-blue-200/80 leading-tight">
                    Sistem Informasi & Inovasi<br />Riset Daerah
                  </p>
                </div>
              </Link>
            ) : (
              <div className="hidden md:flex justify-center">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo sinova.png"
                    alt="SINOVA Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {isOpen && (
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 md:hidden"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* MENU */}
          <nav className="flex-1 p-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveMenu(item.href)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${activeMenu === item.href ? "bg-white/15" : "hover:bg-white/10"}
                  ${!isOpen && "md:justify-center"}
                `}
              >
                <item.icon size={22} />
                {isOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* FOOTER */}
          <div className="border-t border-white/10 p-4">
          {/* User Profile */}
          <Link href="/edit-profil" className="block">
              <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group
                ${!isOpen && "md:justify-center md:p-3"}
              `}>
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    {user?.name?.slice(0, 2).toUpperCase() || "AU"}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#1F4E73]"></div>
                </div>
                {isOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.name || "Admin Utama"}
                    </p>
                    <p className="text-xs text-blue-200/70">Admin</p>
                  </div>
                )}
              </div>
            </Link>
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/20 rounded-xl
                ${!isOpen && "md:justify-center"}
              `}
            >
              <LogOut size={20} />
              {isOpen && <span>Keluar</span>}
            </button>
          </div>
        </aside>
      </div>

      {/* MODAL LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 w-80">
            <h3 className="font-bold mb-4">Konfirmasi Keluar</h3>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowLogoutModal(false)}>Batal</button>
              <button onClick={handleLogout} className="text-red-600">
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarAdmin;
