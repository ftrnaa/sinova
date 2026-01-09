"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Package, User, LogOut, Menu, X, Lightbulb, FileText } from "lucide-react";
import Image from "next/image";

const SidebarPengguna = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<{ name: string; foto?: string } | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  const router = useRouter();

  // ================= SET ACTIVE MENU BASED ON URL =================
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveMenu(window.location.pathname);
    }
  }, []);

  // ================= FETCH ADMIN =================
  useEffect(() => {
    const fetchPengguna = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const res = await fetch(`${API_URL}/auth/pengguna/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Gagal ambil data admin");

        const data = await res.json();
        setUser({ name: data.name, foto: data.foto_profil || "" });
      } catch {
        setUser({ name: "Pengguna" });
      }
    };

    fetchPengguna();
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
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    window.dispatchEvent(new Event("auth-change"));
    router.replace("/");
  };

  const menuItems = [
    { href: "/dashboard_pengguna", icon: Home, label: "Dashboard" },
    { href: "/riwayat_usulan", icon: Lightbulb, label: "Riwayat Usulan" },
    { href: "/edit-profil", icon: User, label: "Profil" },
  ];

  return (
    <>
      <div className="flex h-screen">
        {/* MOBILE TOGGLE */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="p-3 bg-gradient-to-br from-[#1F4E73] to-[#2d5f8d] text-white fixed top-4 left-4 z-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 md:hidden"
          >
            <Menu size={20} />
          </button>
        )}

        {/* SIDEBAR */}
        <div
  className={`bg-gradient-to-b from-[#1F4E73] to-[#163952] text-white h-screen fixed md:static 
  transition-all duration-300 z-40 shadow-2xl flex flex-col
  ${isOpen ? "w-64" : "w-0 md:w-20"} overflow-hidden`}
>

          {/* HEADER */}
          <div className={`p-6 border-b border-white/10 backdrop-blur-sm ${isOpen ? "" : "md:p-4"}`}>
            {isOpen ? (
              <Link href="/" className="block group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg overflow-hidden flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                   <Image
                            src="/logo sinova.jpeg"   // nama file di public
                          alt="Logo SINOVA"
                          width={40}
                          height={40}
                          className="object-cover"
                          priority
                        />
                      </div>

                  <div>
                    <h1 className="text-xl font-bold tracking-wide">SINOVA</h1>
                    <p className="text-[10px] text-blue-200/80 leading-tight mt-0.5">
                      Sistem Informasi & Inovasi<br />Riset Daerah
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="hidden md:flex justify-center">
                <div className="w-10 h-10 bg-white/10 rounded-lg overflow-hidden flex items-center justify-center backdrop-blur-sm">
                <Image
                  src="/logo sinova jpeg"
                  alt="Logo SINOVA"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>

              </div>
            )}
            
            {/* Close button for mobile */}
            {isOpen && (
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors md:hidden"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* MENU */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveMenu(item.href)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                  ${activeMenu === item.href 
                    ? "bg-white/15 shadow-lg" 
                    : "hover:bg-white/10"
                  }
                  ${!isOpen && "md:justify-center md:px-2"}
                `}
              >
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon */}
                <div className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${activeMenu === item.href ? "text-white" : "text-blue-200"}`}>
                  <item.icon size={22} strokeWidth={2.5} />
                </div>
                
                {/* Label */}
                {isOpen && (
                  <span className="relative z-10 font-medium text-sm">
                    {item.label}
                  </span>
                )}
                
                {/* Active indicator */}
                {activeMenu === item.href && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* FOOTER */}
          <div className="mt-auto border-t border-white/10 p-4 space-y-3 backdrop-blur-sm">

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
                    <p className="text-xs text-blue-200/70">Pengguna</p>
                  </div>
                )}
              </div>
            </Link>

            {/* LOGOUT BUTTON */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-300 group
                ${!isOpen && "md:justify-center md:px-2"}
              `}
            >
              <LogOut size={20} className="group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
              {isOpen && <span>Keluar</span>}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL LOGOUT ================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Konfirmasi Keluar</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Apakah Anda yakin ingin keluar dari sistem? Anda perlu login kembali untuk mengakses dashboard.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarPengguna;