"use client";

import { X, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Kategori {
  kategori_id: number | string;
  nama_kategori: string;
}

interface Usulan {
  id: number | string;
  nama: string;
  email: string;
  telp?: string;
  jabatan?: string;
  alamat?: string;
  nama_perusahaan?: string;
  email_perusahaan?: string;
  telp_perusahaan?: string;
  alamat_perusahaan?: string;
  jenis_produk: string;
  kategori_id: number | string;
  tanggal_kebutuhan?: string;
  estimasi_budget?: string;
  deskripsi: string;
}

export default function EditUsulanModal({
  usulan,
  onClose,
  onSuccess,
}: {
  usulan: Usulan;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<Usulan>([] as unknown as Usulan);
  const [loading, setLoading] = useState(false);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [loadingKategori, setLoadingKategori] = useState(true);

  useEffect(() => {
    if (usulan) {
      setForm({
        ...usulan,
        kategori_id: usulan.kategori_id ?? "",
      });
    }
  }, [usulan]);

  // Fetch kategori
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/kategori");
        const data = await res.json();
        setKategoriList(data);
      } catch (err) {
        console.error("fetch kategori error:", err);
        setKategoriList([]);
      } finally {
        setLoadingKategori(false);
      }
    };

    fetchKategori();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: Usulan) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const kategoriID = Number(form.kategori_id);

    if (!kategoriID) {
      toast("Kategori wajib dipilih!");
      setLoading(false);
      return;
    }

    const payload = {
      nama: form.nama,
      email: form.email,
      telp: form.telp,
      jabatan: form.jabatan,
      alamat: form.alamat,
      nama_perusahaan: form.nama_perusahaan,
      email_perusahaan: form.email_perusahaan,
      telp_perusahaan: form.telp_perusahaan,
      alamat_perusahaan: form.alamat_perusahaan,
      jenis_produk: form.jenis_produk,
      kategori_id: kategoriID,
      tanggal_kebutuhan: form.tanggal_kebutuhan,
      estimasi_budget: form.estimasi_budget,
      deskripsi: form.deskripsi,
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/kebutuhan/${form.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Backend error:", data);
        throw new Error(data.message || "Gagal update");
      }
      toast("Usulan berhasil diperbarui!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Submit error:", err);
      toast("Gagal update usulan");
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 bg-[#1F4E73] text-white sticky top-0 z-10">
          <h2 className="font-bold text-lg">Edit Usulan</h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* FORM - Scrollable Area */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* DATA PRIBADI */}
            <section>
              <p className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">
                Data Pribadi
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="nama"
                    value={form.nama || ""}
                    onChange={handleChange}
                    placeholder="Masukkan Nama Anda"
                    className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email Pribadi <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email || ""}
                    onChange={handleChange}
                    placeholder="contoh@gmail.com"
                    className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Nomor Telepon
                  </label>
                  <input
                    name="telp"
                    value={form.telp || ""}
                    onChange={handleChange}
                    placeholder="Contoh: 0812xxxx"
                    className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Jabatan
                  </label>
                  <input
                    name="jabatan"
                    value={form.jabatan || ""}
                    onChange={handleChange}
                    placeholder="Contoh: Manajer Pemasaran"
                    className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="alamat"
                    value={form.alamat || ""}
                    onChange={handleChange}
                    placeholder="Jalan, kota, provinsi"
                    rows={2}
                    className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* DATA PERUSAHAAN */}
            <section>
              <p className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">
                Data Perusahaan
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Nama Perusahaan
                  </label>
                  <input
                    name="nama_perusahaan"
                    value={form.nama_perusahaan || ""}
                    onChange={handleChange}
                    placeholder="PT Jaya Abadi"
                    className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email Perusahaan
                  </label>
                  <input
                    name="email_perusahaan"
                    type="email"
                    value={form.email_perusahaan || ""}
                    onChange={handleChange}
                    placeholder="hrd@perusahaan.com"
                    className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Nomor Telepon Perusahaan
                  </label>
                  <input
                    name="telp_perusahaan"
                    value={form.telp_perusahaan || ""}
                    onChange={handleChange}
                    placeholder="Nomor kontak perusahaan"
                    className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Alamat Perusahaan
                  </label>
                  <textarea
                    name="alamat_perusahaan"
                    value={form.alamat_perusahaan || ""}
                    onChange={handleChange}
                    placeholder="Alamat kantor pusat"
                    rows={2}
                    className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* DETAIL USAHA */}
            <section>
              <p className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-800">
                Detail Usulan Produk
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Jenis Produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="jenis_produk"
                    value={form.jenis_produk || ""}
                    onChange={handleChange}
                    placeholder="Contoh: Aplikasi Mobile"
                    className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="kategori_id"
                    value={form.kategori_id || ""}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                    required
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {loadingKategori ? (
                      <option disabled>Loading...</option>
                    ) : (
                      kategoriList.map((b) => (
                        <option key={b.kategori_id} value={b.kategori_id}>
                          {b.nama_kategori}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    name="tanggal_kebutuhan"
                    value={formatDateForInput(form.tanggal_kebutuhan)}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Estimasi Budget
                  </label>
                  <input
                    name="estimasi_budget"
                    value={form.estimasi_budget || ""}
                    onChange={handleChange}
                    placeholder="Contoh: 50-100 juta"
                    className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Deskripsi Kebutuhan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="deskripsi"
                    value={form.deskripsi || ""}
                    onChange={handleChange}
                    placeholder="Jelaskan detail kebutuhan..."
                    rows={4}
                    className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all resize-none"
                    required
                  />
                </div>
              </div>
            </section>

            {/* FOOTER BUTTONS */}
            <div className="border-t border-gray-300 pt-4">
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded flex gap-2 items-center hover:bg-blue-700 transition-colors disabled:opacity-50">
                  <Save size={16} />
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Tailwind helper */
const input = "w-full p-2 border rounded border-gray-300";
