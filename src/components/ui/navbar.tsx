'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ================= AUTH SYNC =================
  useEffect(() => {
    const updateUser = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setUsername(localStorage.getItem("username"));
      setRole(localStorage.getItem("role"));
    };

    updateUser();
    window.addEventListener("storage", updateUser);
    window.addEventListener("auth-change", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("auth-change", updateUser);
    };
  }, []);

  // ================= CLOSE DROPDOWN OUTSIDE =================
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ================= CLOSE MOBILE MENU ON ROUTE CHANGE =================
  useEffect(() => {
    setMobileMenu(false);
  }, [router]);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    setUsername(null);
    setRole(null);

    setIsDropdownOpen(false);
    setMobileMenu(false);

    window.dispatchEvent(new Event("auth-change"));
    router.replace("/");
  };

  const dashboardLink =
    role === "pengguna"
      ? "/dashboard_pengguna"
      : role === "penyedia"
      ? "/dashboard_penyedia"
      : role === "admin"
      ? "/dashboard_admin"
      : "/dashboard";

  const menuItems = [
    { name: "Beranda", href: "/" },
    { name: "Profil", href: "/profile" },
    { name: "Katalog Produk", href: "/katalog" },
    { name: "Riset", href: "/riset" },
    { name: "Panduan", href: "/information" },
    { name: "Layanan", href: "/layanan" },
    { name: "Hubungi Kami", href: "/hubungi-kami" },
  ];

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="bg-[#F3F7FB] border-b-4 border-[#1F4E73] fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="flex justify-between items-center px-6 sm:px-12 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Logo SINOVA" 
              width={60} 
              height={50}
              priority
            />
            <div className="hidden sm:block leading-tight">
              <h1 className="font-extrabold text-[#1F4E73] text-xl sm:text-2xl">
                SINOVA
              </h1>
              <p className="text-[#1F4E73] text-xs">
                Sistem Informasi & Inovasi Riset Daerah
              </p>
            </div>
          </Link>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="text-[#1F4E73] text-2xl sm:hidden z-50 relative"
            aria-label="Toggle menu"
          >
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>

          {/* Desktop User */}
          <div className="hidden sm:block relative" ref={dropdownRef}>
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="bg-[#1F4E73] text-white px-4 py-2 rounded-lg hover:bg-[#163d5a] transition-colors"
              >
                Masuk
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-[#1F4E73] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#163d5a] transition-colors"
                >
                  <span>{username || "Akun"}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                    <Link
                      href={dashboardLink}
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="bg-[#1F4E73] text-white hidden sm:flex justify-center">
          <ul className="flex">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href} 
                  className="px-5 py-3 block hover:bg-[#163954] transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* ================= SPACER - PERBAIKAN TINGGI ================= */}
      {/* Desktop: Header (80px) + Menu (48px) = 128px */}
      {/* Mobile: Header only = 80px */}
      <div className="h-[80px] sm:h-[132px]" />

      {/* ================= MOBILE MENU ================= */}
      {mobileMenu && (
        <div className="fixed top-[80px] left-0 right-0 bg-[#1F4E73] text-white px-6 py-4 sm:hidden z-40 shadow-lg max-h-[calc(100vh-80px)] overflow-y-auto">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="block py-3 border-b border-white/10 hover:bg-[#163954] px-2 rounded transition-colors"
              onClick={() => setMobileMenu(false)}
            >
              {item.name}
            </Link>
          ))}

          <div className="mt-4 pt-4 border-t border-white/20">
            {!isLoggedIn ? (
              <Link 
                href="/login" 
                className="block bg-white text-[#1F4E73] py-3 text-center rounded-lg font-medium hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenu(false)}
              >
                Masuk
              </Link>
            ) : (
              <>
                <Link 
                  href={dashboardLink} 
                  className="block bg-white text-[#1F4E73] py-3 text-center rounded-lg font-medium hover:bg-gray-100 transition-colors mb-2"
                  onClick={() => setMobileMenu(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenu(false);
                    setShowLogoutModal(true);
                  }}
                  className="block w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Keluar
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= LOGOUT MODAL ================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Konfirmasi Keluar</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Apakah Anda yakin ingin keluar dari akun ini? Anda harus login kembali untuk mengakses dashboard.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay untuk mobile menu */}
      {mobileMenu && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 sm:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}
    </>
  );
}