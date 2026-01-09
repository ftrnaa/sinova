"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// =====================
// TYPES
// =====================
interface FormData {
  namaLengkap: string;
  email: string;
  noTelepon: string;
}

interface ProfileApiResponse {
  name: string | null;
  email: string | null;
  no_handphone: string | null;
  foto_profil: string | null;
}

interface UpdateApiResponse {
  user?: {
    name: string;
    email: string;
    no_handphone: string;
  };
  message?: string;
}

export default function ProfileEdit() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    namaLengkap: "",
    email: "",
    noTelepon: "",
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const username =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;

  // =====================
  // HARD CODE URL BACKEND
  // =====================
  const API_URL = "https://sinovabackend-production.up.railway.app";

  // =====================
  // FETCH PROFILE
  // =====================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token tidak ditemukan");

        const res = await fetch(`${API_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal mengambil profil");

        const data: ProfileApiResponse = await res.json();

        setFormData({
          namaLengkap: data.name ?? "",
          email: data.email ?? "",
          noTelepon: data.no_handphone ?? "",
        });

        if (data.foto_profil) {
          setPhotoPreview(`${API_URL}/${data.foto_profil}`);
        }
      } catch (err) {
        console.error(err);
        alert("Gagal memuat profil, coba refresh halaman");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =====================
  // INPUT HANDLER
  // =====================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // =====================
  // UPLOAD FOTO
  // =====================
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // =====================
  // SUBMIT UPDATE PROFILE
  // =====================
  const handleSubmit = async () => {
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const form = new FormData();
      form.append("name", formData.namaLengkap);
      form.append("no_handphone", formData.noTelepon);
      if (photoFile) form.append("foto_profil", photoFile);

      const res = await fetch(`${API_URL}/api/profile/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data: UpdateApiResponse = await res.json();

      if (data.user) {
        alert("Profil berhasil diperbarui!");
      } else {
        alert(data.message || "Gagal update profil");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan profil");
    } finally {
      setSaving(false);
    }
  };

  // =====================
  // LOADING SCREEN
  // =====================
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#1F4E73]/20 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Memuat profil...</p>
        </div>
      </div>
    );
  }

  // =====================
  // RENDER
  // =====================
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 text-gray-700 font-medium shadow-sm hover:shadow-md"
          >
            ← Kembali
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          {/* Header Card */}
          <div className="relative">
            <div className="h-32 sm:h-40 bg-[#1F4E73]"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 sm:-bottom-20">
              <label htmlFor="photo-upload" className="cursor-pointer group">
                <div className="relative">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 bg-white border-white shadow-2xl overflow-hidden flex items-center justify-center group-hover:border-[#1F4E73]/50 transition-all duration-300">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg
                          className="w-12 h-12 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="text-sm font-medium">Foto</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-[#1F4E73] rounded-full p-2.5 shadow-lg group-hover:bg-[#163a56] transition-colors">
                    📷
                  </div>
                </div>
              </label>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
            </div>
          </div>

          {/* Form */}
          <div className="pt-20 sm:pt-24 pb-8 px-6 sm:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {formData.namaLengkap || "Nama Pengguna"}
              </h2>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F4E73]/10 rounded-full border border-[#1F4E73]/20">
                <div className="w-2 h-2 bg-[#1F4E73] rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-[#1F4E73] capitalize">
                  {role || "User"}
                </span>
              </div>
            </div>

            <div className="max-w-xl mx-auto space-y-6">
              {/* Nama */}
              <div className="group">
                <label className="block mb-2 text-sm font-semibold text-[#1F4E73]">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#1F4E73] transition-all duration-200"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              {/* Email */}
              <div className="group">
                <label className="block mb-2 text-sm font-semibold text-[#1F4E73]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-100 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email tidak dapat diubah
                </p>
              </div>

              {/* No Telepon */}
              <div className="group">
                <label className="block mb-2 text-sm font-semibold text-[#1F4E73]">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  name="noTelepon"
                  value={formData.noTelepon}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#1F4E73] transition-all duration-200"
                  placeholder="08123456789"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full py-4 rounded-xl bg-[#1F4E73] hover:bg-[#163a56] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
