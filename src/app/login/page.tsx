"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle, FaGithub } from "react-icons/fa";

const BASE_URL = "http://localhost:4001";

const LOGIN_ENDPOINTS = [
  { role: "pengguna", url: "/auth/pengguna/login" },
  { role: "penyedia", url: "/auth/penyedia/login" },
  { role: "admin", url: "/auth/admin/login" },
  { role: "super_admin", url: "/auth/superadmin/login" },
];

// ============== JWT DECODE ==============
function decodeJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============== MULTI-ROLE LOGIN ==============
  const tryLogin = async () => {
  for (const ep of LOGIN_ENDPOINTS) {
    try {
      console.log("TRYING ENDPOINT:", ep.url, "with", { email, password });

      const res = await fetch(`${BASE_URL}${ep.url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("HTTP STATUS:", res.status, "for", ep.url);

      if (!res.ok) {
        // Print body for non-ok so kita tahu pesan error dari backend
        const errBody = await res.text();
        console.warn("Non-OK response body:", errBody);
        continue;
      }

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data.user.role, data);


      // gunakan nama dari response user (backendmu sudah mengirim user)
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user?.name || "Pengguna");
      localStorage.setItem("role", data.user?.role);  // ← ambil role asli dari DB
      localStorage.setItem("isLoggedIn", "true");
      window.dispatchEvent(new Event("auth-change"));

      return ep.role;
    } catch (err) {
      console.error("FETCH ERROR for", ep.url, err);
      continue;
    }
  }
  return null;
};

  // ============== SUBMIT LOGIN ==============
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const role = await tryLogin();

    if (!role) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }

    router.replace("/");
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F3F7FB]">
      <div className="flex w-[800px] bg-white rounded-3xl shadow-xl overflow-hidden border border-[#1F4E73]">

        {/* LEFT LOGIN */}
        <div className="flex flex-col justify-center items-center w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-6 text-[#1F4E73]">Masuk</h2>

          {error && <p className="text-red-600 mb-3">{error}</p>}

          <div className="flex gap-4 mb-4">
            
          </div>

          

          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 mb-3 w-full bg-blue-50"
              required
            />

            <input
              type="password"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 mb-3 w-full bg-blue-50"
              required
            />

            <a href="lupa_katasandi" className="text-xs text-gray-500 mb-4">
              Lupa kata sandi?
            </a>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#1F4E73] text-white font-semibold px-6 py-2 rounded-md w-full hover:bg-[#163954]"
            >
              {loading ? "Memproses..." : "MASUK"}
            </button>
          </form>
        </div>

        {/* RIGHT REGISTER PANEL */}
        <div className="flex flex-col justify-center items-center w-1/2 bg-[#1F4E73] text-white p-10 rounded-l-[80px]">
          <h2 className="text-2xl font-bold mb-2">Halo, Teman Baru!</h2>
          <p className="text-sm mb-6 text-center">
            Daftarkan akun kamu untuk menggunakan semua fitur kami.
          </p>

          <Link
            href="/register"
            className="border border-white px-6 py-2 rounded-md hover:bg-white hover:text-[#1F4E73] transition"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}
