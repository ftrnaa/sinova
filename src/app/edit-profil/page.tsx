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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:4001/api/profile/me", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        const data: ProfileApiResponse = await res.json();

        setFormData({
          namaLengkap: data.name ?? "",
          email: data.email ?? "",
          noTelepon: data.no_handphone ?? "",
        });

        if (data.foto_profil) {
          setPhotoPreview("http://localhost:4001/" + data.foto_profil);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  // INPUT HANDLER
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // UPLOAD FOTO
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // SUBMIT UPDATE PROFILE
  const handleSubmit = async () => {
    setSaving(true);
    const form = new FormData();
    form.append("name", formData.namaLengkap);
    form.append("no_handphone", formData.noTelepon);

    if (photoFile) {
      form.append("foto_profil", photoFile);
    }

    try {
      const res = await fetch("http://localhost:4001/api/profile/update", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: form,
      });

      const data: UpdateApiResponse = await res.json();

      if (data.user) {
        alert("Profil berhasil diperbarui!");
      } else {
        alert("Gagal update profil");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#1F4E73]/20 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#1F4E73] mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="mt-4 text-gray-700 font-medium">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header dengan tombol kembali */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 text-gray-700 font-medium shadow-sm hover:shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          {/* Header Card dengan bg-[#1F4E73] */}
          <div className="relative">
            <div className="h-32 sm:h-40 bg-[#1F4E73]"></div>

            {/* Photo Profile */}
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

                  {/* Camera Icon Overlay */}
                  <div className="absolute bottom-2 right-2 bg-[#1F4E73] rounded-full p-2.5 shadow-lg group-hover:bg-[#163a56] transition-colors">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
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

          {/* Profile Info */}
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

            {/* Form Section */}
            <div className="max-w-xl mx-auto space-y-6">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-3 border-b-2 border-[#1F4E73]">
                <svg
                  className="w-6 h-6 text-[#1F4E73]"
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
                <h3 className="text-lg font-bold text-[#1F4E73]">
                  Informasi Pribadi
                </h3>
              </div>

              {/* Input Fields */}
              <div className="space-y-5">
                {/* Nama Lengkap */}
                <div className="group">
                  <label className="block mb-2 text-sm font-semibold text-[#1F4E73]">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-[#1F4E73]/50"
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
                    </div>
                    <input
                      type="text"
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 text-gray-900 outline-none focus:border-[#1F4E73] transition-all duration-200 font-medium"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block mb-2 text-sm font-semibold text-[#1F4E73]">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-[#1F4E73]/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-100 border-2 border-gray-200 text-gray-600 outline-none cursor-not-allowed font-medium"
                      placeholder="email@example.com"
                      disabled
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Email tidak dapat diubah
                  </p>
                </div>

                {/* No. Telepon */}
                <div className="group">
                  <label className="block mb-2 text-sm font-semibold text-[#1F4E73]">
                    No. Telepon
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-[#1F4E73]/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      name="noTelepon"
                      value={formData.noTelepon}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 text-gray-900 outline-none focus:border-[#1F4E73] transition-all duration-200 font-medium"
                      placeholder="08123456789"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="w-full py-4 rounded-xl bg-[#1F4E73] hover:bg-[#163a56] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}