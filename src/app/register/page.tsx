"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://sinovabackend-production.up.railway.app";

  const handleRegister = async () => {
    if (!nama || !email || !password) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return toast.error(data.message || "Gagal registrasi!");
      }

      toast.success("✅ Registrasi berhasil!");
      // Jika backend langsung login, simpan token:
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Reset form
      setNama("");
      setEmail("");
      setPassword("");

      // Redirect ke login
      window.location.href = "/login";
    } catch (err: any) {
      console.error("Register error:", err);
      toast.error("❌ Gagal registrasi: " + (err.message || "unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F3F7FB]">
      <div className="w-[400px] bg-white p-10 rounded-3xl shadow-xl border border-[#1F4E73]">
        <h1 className="text-2xl font-bold text-[#1F4E73] text-center mb-6">
          Registrasi
        </h1>

        <input
          type="text"
          placeholder="Nama Lengkap"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E73]"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E73]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E73]"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-[#1F4E73] text-white py-2 rounded-md font-semibold hover:bg-[#163954] transition"
        >
          {loading ? "Mendaftar..." : "Daftar"}
        </button>

        <p
          className="text-sm text-[#1F4E73] text-center mt-4 underline cursor-pointer"
          onClick={() => (window.location.href = "/login")}
        >
          Sudah punya akun? Login
        </p>
      </div>
    </div>
  );
}
