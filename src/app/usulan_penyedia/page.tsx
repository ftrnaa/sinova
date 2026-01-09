"use client";

import { useEffect, useState, useCallback } from "react";
import SidebarPenyedia from "@/components/ui/sidebar_penyedia";
import UsulanCard from "@/components/ui/usulan/UsulanCard";
import FilterUsulan from "@/components/ui/usulan/FilterUsulan";
import DetailUsulanModal from "@/components/ui/usulan/DetailUsulanModal";
import MinatPenyediaModal from "@/components/ui/usulan/MinatPenyediaModal";
import type { Usulan, Peminat } from "@/types/usulan";
import { toast } from "react-hot-toast";

interface RawUsulan {
  id: number;
  nama?: string;
  alamat?: string;
  telp?: string;
  jabatan?: string;
  nama_perusahaan?: string;
  email_perusahaan?: string;
  alamat_perusahaan?: string;
  telp_perusahaan?: string;
  jenis_produk?: string;
  deskripsi?: string;
  tanggal_kebutuhan?: string;
  estimasi_budget?: number;
  dokumen?: string | null;
  created_at?: string;
  status?: string;
  status_detail?: string;
  kategori_id?: number | null;
  nama_kategori?: string;
  peminat?: number;
  penyedia_dikerjakan?: number | null;
}
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}
interface FilterCounts {
  total: number;
  tersedia: number;
  dikerjakan: number;
}

export default function UsulanPenyediaPage() {
  const [usulan, setUsulan] = useState<RawUsulan[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("semua");
  const [selectedUsulan, setSelectedUsulan] = useState<Usulan | null>(null);
  const [showDetailUsulanModal, setShowDetailUsulanModal] = useState(false);
  const [showMinatPenyediaModal, setShowMinatPenyediaModal] = useState(false);
  const [search, setSearch] = useState("");

  
  // tambahan state modal peminat
  const [showSetujuProposal, setShowSetujuProposal] = useState(false);
  const [peminatList, setPeminatList] = useState<Peminat[]>([]);

  const BASE_URL = "http://localhost:4001";

  const mapStatus = (status?: string): string => {
    if (status === "Menunggu") return "Tersedia";
    if (status === "Sedang Dikerjakan") return "Sedang Dikerjakan";
    if (status === "Selesai") return "Selesai";
    return "Tersedia";
  };

  const fetchUsulan = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/api/kebutuhan/penyedia`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result: ApiResponse | RawUsulan[] = await res.json();
      const list = Array.isArray(result) ? result : (result as ApiResponse).data;
      setUsulan(list ?? []);
    } catch (err) {
      console.error("Gagal memuat usulan:", err);
    }
  }, []);

  useEffect(() => {
    fetchUsulan();
  }, [fetchUsulan]);

    const normalizedUsulan = Array.isArray(usulan)
  ? usulan.map((u: any) => ({
      id: u.id,
      nama: u.nama ?? "",
      alamat: u.alamat ?? "",
      email: u.email ?? "",
      noTelp: u.telp ?? "",
      jabatan: u.jabatan ?? "",

      namaPerusahaan: u.nama_perusahaan ?? "",
      emailPerusahaan: u.email_perusahaan ?? "",
      alamatPerusahaan: u.alamat_perusahaan ?? "",
      noTelpPerusahaan: u.telp_perusahaan ?? "",

      jenisProdukanDiusulkan: u.jenis_produk ?? "",
      deskripsiKebutuhan: u.deskripsi ?? "",
      kapanDigunakan: u.tanggal_kebutuhan ?? "",
      estimasiBudget: u.estimasi_budget ?? 0,

      dokumen: u.dokumen ?? null,
      tanggal: u.created_at ?? "",

      status: mapStatus(u.status) ?? "",
      statusDetail: u.status_detail ?? "",

      kategori_id: u.kategori_id ?? null,
      nama_kategori: u.nama_kategori ?? "Tidak ada kategori",

      peminat: u.peminat ?? 0,
      penyediaDikerjakan: u.penyedia_dikerjakan ?? null,
    }))
  : [];

  const counts: FilterCounts = {
    total: normalizedUsulan.length,
    tersedia: normalizedUsulan.filter((u) => u.status === "Tersedia").length,
    dikerjakan: normalizedUsulan.filter((u) => u.status === "Sedang Dikerjakan").length,
  };

  const filteredUsulan = normalizedUsulan.filter((u) => {
    const s = search.toLowerCase();
    return (
      (u.nama.toLowerCase().includes(s) ||
        u.jenisProdukanDiusulkan.toLowerCase().includes(s) ||
        u.deskripsiKebutuhan.toLowerCase().includes(s)) &&
      (selectedFilter === "semua" ? true : u.status === selectedFilter)
    );
  });
 
  // AJUKAN PROPOSAL
  const handleOpenAjukanProposal = () => {
    setShowDetailUsulanModal(false);
    setShowMinatPenyediaModal(true);
  };

  const handleSubmitProposal = async (
    kebutuhan_id: number | string,
    file: File,
    deskripsi?: string
  ) => {
    if (!kebutuhan_id || !file) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("kebutuhan_id", String(kebutuhan_id));
      formData.append("proposal_file", file);
      if (deskripsi) formData.append("deskripsi", deskripsi);

      const res = await fetch(`${BASE_URL}/api/minat-penyedia`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result: ApiResponse = await res.json();
      if (result.success) {
        toast.success("✅ Proposal berhasil diajukan!");
        setShowMinatPenyediaModal(false);
        fetchUsulan();
      } else {
        toast.error("❌ Gagal mengajukan proposal: " + result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Terjadi kesalahan saat submit proposal");
    }
  };

  const handleOpenPeminat = async (kebutuhanId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `${BASE_URL}/api/minat/kebutuhan/${kebutuhanId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Gagal fetch peminat");

      const data: Peminat[] = await res.json();

    // ✅ backend kamu return ARRAY langsung
    setPeminatList(data);
    setShowSetujuProposal(true);
  } catch (err) {
    console.error(err);
    toast.error("❌ Gagal memuat peminat");
  }
};


  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarPenyedia />

      <div className="flex-1 overflow-y-auto">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#3e81aa] to-[#1F4E73] text-white shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Usulan Kebutuhan</h1>
            <p className="text-blue-100 text-sm">Selamat datang penyedia! Lihat usulan di sini</p>
          </div>
        </div>

        {/* FILTER */}
        <div className="px-4 pt-6 space-y-6">
          <FilterUsulan
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            search={search}
            setSearch={setSearch}
            counts={counts}
          />
        </div>

        {/* LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {filteredUsulan.map((u) => (
            <UsulanCard
              key={u.id}
              usulan={u}
              kategoriName={u.nama_kategori}
              onClick={() => {
                setSelectedUsulan(u);
                setShowDetailUsulanModal(true);
              }}
            />
          ))}
        </div>

        {/* MODAL DETAIL */}
        {showDetailUsulanModal && selectedUsulan && (
          <DetailUsulanModal
            usulan={selectedUsulan}
            onClose={() => setShowDetailUsulanModal(false)}
            onOpenPeminat={handleOpenPeminat}
            onAjukanProposal={handleOpenAjukanProposal}
          />
        )}

        {/* MODAL AJUKAN PROPOSAL */}
        {showMinatPenyediaModal && selectedUsulan && (
          <MinatPenyediaModal
            show={showMinatPenyediaModal}
            selectedUsulan={selectedUsulan}
            onClose={() => setShowMinatPenyediaModal(false)}
            onSuccess={handleSubmitProposal}
          />
        )}

        {/* MODAL PEMINAT */}
        {showSetujuProposal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Daftar Peminat</h2>
              <ul className="space-y-2">
                {peminatList.length > 0 ? (
                  peminatList.map((p: Peminat) => (
                    <li key={p.minat_id} className="border-b py-2">
                      <span className="font-medium">{p.nama}</span> - {p.email} <br />
                      Estimasi Biaya: {p.estimasi_biaya} | Estimasi Waktu: {p.estimasi_waktu} hari
                    </li>
                  ))
                ) : (
                  <li>Tidak ada peminat</li>
                )}
              </ul>
              <button
                onClick={() => setShowSetujuProposal(false)}
                className="mt-4 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}