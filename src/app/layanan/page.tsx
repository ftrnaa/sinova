"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:4001";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const InputField = ({ label, name, type = "text", placeholder = "", value, onChange }: InputFieldProps) => (
  <div className="mb-3">
    <label htmlFor={name} className="block text-sm font-medium mb-1 text-white/90">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 rounded bg-white text-[#1F4E73] border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
    />
  </div>
);

interface Kategori {
  kategori_id: number | string;
  nama_kategori: string;
}

export default function LayananPage() {
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [loadingKategori, setLoadingKategori] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    email: "",
    telp: "",
    jabatan: "",
    nama_perusahaan: "",
    email_perusahaan: "",
    alamat_perusahaan: "",
    telp_perusahaan: "",
    jenis_produk: "",
    tanggal_kebutuhan: "",
    estimasi_budget: "",
    deskripsi: "",
    kategori_id: "",
    dokumen: null as File | null,
  });

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/kategori`);
        if (!res.ok) throw new Error("Gagal fetch kategori");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData(prev => ({ ...prev, dokumen: file }));
  };

  const validate = () => {
    if (!formData.kategori_id) { toast("Pilih kategori terlebih dahulu."); return false; }
    if (!formData.jenis_produk.trim()) { toast("Isi jenis produk."); return false; }
    if (!formData.deskripsi.trim()) { toast("Isi deskripsi kebutuhan."); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Ambil token
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("❌ Anda belum login.");
      window.location.href = "/login";
      return;
    }

    if (!validate()) return;
    setSubmitting(true);

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) fd.append(key, value as any);
      });

      const res = await fetch(`${BASE_URL}/api/kebutuhan`, {
        method: "POST",
        body: fd,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || `Server returned ${res.status}`);

      toast.success("✅ Usulan berhasil diajukan!");
      setFormData({
        nama: "", alamat: "", email: "", telp: "", jabatan: "",
        nama_perusahaan: "", email_perusahaan: "", alamat_perusahaan: "", telp_perusahaan: "",
        jenis_produk: "", tanggal_kebutuhan: "", estimasi_budget: "", deskripsi: "",
        kategori_id: "", dokumen: null
      });
    } catch (err: any) {
      console.error("submit error:", err);
      toast.error("❌ Gagal kirim usulan: " + (err.message || "unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white py-10 flex justify-center">
        <div className="bg-[#1F4E73] text-white w-full max-w-2xl rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Layanan Usulan Produk</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section>
              <p className="text-lg font-semibold border-b border-white pb-2">Data Pribadi</p>
              <InputField label="Nama Lengkap" name="nama" value={formData.nama} onChange={handleChange} />
              <InputField label="Alamat Lengkap" name="alamat" value={formData.alamat} onChange={handleChange} />
              <InputField label="Email Pribadi" name="email" type="email" value={formData.email} onChange={handleChange} />
              <InputField label="Nomor Telepon" name="telp" value={formData.telp} onChange={handleChange} />
              <InputField label="Jabatan" name="jabatan" value={formData.jabatan} onChange={handleChange} />
            </section>

            <section>
              <p className="text-lg font-semibold border-b border-white/50 pb-2 pt-4">Data Perusahaan</p>
              <InputField label="Nama Perusahaan" name="nama_perusahaan" value={formData.nama_perusahaan} onChange={handleChange} />
              <InputField label="Email Perusahaan" name="email_perusahaan" type="email" value={formData.email_perusahaan} onChange={handleChange} />
              <InputField label="Alamat Perusahaan" name="alamat_perusahaan" value={formData.alamat_perusahaan} onChange={handleChange} />
              <InputField label="Nomor Telepon Perusahaan" name="telp_perusahaan" value={formData.telp_perusahaan} onChange={handleChange} />
            </section>

            <section>
              <p className="text-lg font-semibold border-b border-white/50 pb-2 pt-4">Detail Usulan Produk</p>
              <InputField label="Jenis Produk" name="jenis_produk" value={formData.jenis_produk} onChange={handleChange} />

              {/* Dropdown Kategori */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-white/90">Kategori</label>
                <select name="kategori_id" value={formData.kategori_id} onChange={handleChange} className="w-full p-2 rounded bg-white text-[#1F4E73]">
                  <option value="">-- Pilih kategori --</option>
                  {loadingKategori ? <option disabled>Loading...</option> :
                    kategoriList.map(k => <option key={k.kategori_id} value={k.kategori_id}>{k.nama_kategori}</option>)}
                </select>
              </div>

              <InputField label="Tanggal Pelaksanaan" name="tanggal_kebutuhan" type="date" value={formData.tanggal_kebutuhan} onChange={handleChange} />
              <InputField label="Estimasi Budget" name="estimasi_budget" value={formData.estimasi_budget} onChange={handleChange} />

              <div>
                <label className="block text-sm font-medium mb-1 text-white/90">Deskripsi Kebutuhan</label>
                <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={4} className="w-full p-2 rounded bg-white text-[#1F4E73]"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white/90">Dokumen Pendukung (opsional)</label>
                <input type="file" onChange={handleFileChange} className="w-full p-2 rounded bg-white text-[#1F4E73]" />
              </div>
            </section>

            <button type="submit" disabled={submitting} className="w-full py-3 bg-white text-[#1F4E73] font-bold rounded-lg hover:bg-gray-200 transition">
              {submitting ? "Mengirim..." : "AJUKAN USULAN"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
