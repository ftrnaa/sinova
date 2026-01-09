"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  role: "pengguna" | "penyedia";
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    role: "pengguna",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = "https://sinovabackend-production.up.railway.app";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value } as RegisterForm);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // endpoint register berbeda untuk pengguna & penyedia di backendmu
      const endpoint =
        form.role === "pengguna"
          ? `${BASE_URL}/auth/pengguna/register`
          : `${BASE_URL}/auth/penyedia/register`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || "Pendaftaran gagal");
        setLoading(false);
        return;
      }

      // jika backend mengembalikan user & token (opsional),
      // kamu bisa simpan token langsung dan redirect
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user?.name ?? form.name);
        localStorage.setItem("role", form.role);
        localStorage.setItem("isLoggedIn", "true");

        // redirect to role dashboard
        router.push(form.role === "pengguna" ? "/dashboard_pengguna" : "/dashboard_penyedia");
      } else {
        // jika backend cuma kembalikan message/user tanpa token
        // redirect ke login supaya user melakukan login
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      setError("Tidak dapat menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F3F7FB]">
      <div className="flex w-[850px] bg-white rounded-3xl shadow-xl overflow-hidden border border-[#1F4E73]">
        {/* Left: Info */}
        <div className="flex flex-col justify-center items-center w-1/2 bg-[#1F4E73] text-white p-10 rounded-r-[80px]">
          <h2 className="text-2xl font-bold mb-2">Pendaftaran Akun</h2>
          <p className="text-sm text-center">Isi data untuk membuat akun pengguna atau penyedia.</p>
          
        </div>
   
        {/* Right: Register form */}
        <div className="flex flex-col justify-center items-center w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-6 text-[#1F4E73]">Daftar</h2>

          {error && <p className="text-red-600 mb-3">{error}</p>}

          <form className="w-full" onSubmit={handleSubmit}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama Lengkap"
              className="border border-gray-300 rounded-md px-4 py-2 mb-3 w-full bg-blue-50"
              required
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border border-gray-300 rounded-md px-4 py-2 mb-3 w-full bg-blue-50"
              required
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Kata Sandi"
              className="border border-gray-300 rounded-md px-4 py-2 mb-3 w-full bg-blue-50"
              required
            />

            <div className="w-full mb-4">
              <p className="mb-1 text-sm font-medium text-[#1F4E73]">Daftar sebagai:</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="pengguna"
                    checked={form.role === "pengguna"}
                    onChange={handleChange}
                  />
                  <span className="ml-1">Pengguna Inovasi</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="penyedia"
                    checked={form.role === "penyedia"}
                    onChange={handleChange}
                  />
                  <span className="ml-1">Penyedia Inovasi </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#1F4E73] text-white font-semibold px-6 py-2 rounded-md w-full hover:bg-[#163954]"
            >
              {loading ? "Memproses..." : "DAFTAR"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
