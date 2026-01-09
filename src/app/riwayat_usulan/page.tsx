"use client";

import { useEffect, useState, useCallback } from "react";
import SidebarPengguna from "@/components/ui/sidebar_pengguna";
import UsulanCard from "@/components/ui/usulan/UsulanCard";
import FilterUsulan from "@/components/ui/usulan/FilterUsulan";
import SetujuProposal from "@/components/ui/usulan/SetujuProposal";
import DetailUsulanModal from "@/components/ui/usulan/DetailUsulanModal";
import EditUsulanModal from "@/components/ui/usulan/EditUsulanModal";
import type { PenyediaItem } from "@/types/minat";
import type { Usulan, UsulanEdit } from "@/types/usulan";
import { toast } from "react-hot-toast";



export default function RiwayatUsulanPage() {
  const [usulan, setUsulan] = useState<Usulan[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("semua");
  const [selectedUsulan, setSelectedUsulan] = useState<Usulan | null>(null);
  const [selectedRawUsulan, setSelectedRawUsulan] = useState<Usulan | null>(null);
  const [editData, setEditData] = useState<UsulanEdit | null>(null);
  const [showDetailUsulanModal, setShowDetailUsulanModal] = useState(false);
  const [showSetujuProposal, setShowSetujuProposal] = useState(false);
  const [listPeminat, setListPeminat] = useState<PenyediaItem[]>([]);
  const [search, setSearch] = useState("");

const BASE_URL = "https://sinovabackend-production.up.railway.app";

  // ============================================
  // FETCH USULAN
  // ============================================
  const fetchUsulan = useCallback(async () => {
    try {

      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/api/kebutuhan/saya`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("📥 DATA USULAN:", data);
        setUsulan(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal memuat usulan:", err);
    }
  }, []);

  useEffect(() => {
    fetchUsulan();
  }, [fetchUsulan]);

  // ============================================
  // Normalisasi data - GUNAKAN usulan yang sudah dijamin array
  // ============================================
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

      status: u.status ?? "",
      statusDetail: u.status_detail ?? "",

      kategori_id: u.kategori_id ?? null,
      nama_kategori: u.nama_kategori ?? "Tidak ada kategori",

      peminat: u.peminat ?? 0,
      penyediaDikerjakan: u.penyedia_dikerjakan ?? null,
    }))
  : [];


  const counts = {
    total: normalizedUsulan.length,
    tersedia: normalizedUsulan.filter((u) => u.status === "Tersedia").length,
    dikerjakan: normalizedUsulan.filter((u) => u.status === "Sedang Dikerjakan").length,
  };

  const filteredUsulan = normalizedUsulan.filter((u) => {
    const s = search.toLowerCase();
    return (
      (u.nama?.toLowerCase().includes(s) ||
        u.jenisProdukanDiusulkan?.toLowerCase().includes(s) ||
        u.deskripsiKebutuhan?.toLowerCase().includes(s)) &&
      (selectedFilter === "semua"
        ? true
        : u.status.toLowerCase() === selectedFilter.toLowerCase()
      )
    );
  });

  // ============================================
  // ACTION HANDLERS
  // ============================================
  const handleDeleteUsulan = async (id: number) => {
    if (!confirm("Hapus usulan ini?")) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/api/kebutuhan/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchUsulan();
      setShowDetailUsulanModal(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus");
    }
  };

  const handleEditUsulan = (u: Usulan) => {
  setEditData({
    id: u.id,
    nama: u.nama,
    email: u.email,
    telp: u.noTelp,
    jabatan: u.jabatan,
    alamat: u.alamat,
    nama_perusahaan: u.namaPerusahaan,
    email_perusahaan: u.emailPerusahaan,
    telp_perusahaan: u.noTelpPerusahaan,
    alamat_perusahaan: u.alamatPerusahaan,
    jenis_produk: u.jenisProdukanDiusulkan, // 🔥
    kategori_id: u.kategori_id ?? "",
    tanggal_kebutuhan: u.kapanDigunakan,
    estimasi_budget: String(u.estimasiBudget ?? ""),
    deskripsi: u.deskripsiKebutuhan, // 🔥
  });

  setShowDetailUsulanModal(false);
};



  // lihat penyedia yang berminat
  const handleOpenPeminat = async (kebutuhanId: number) => {
    try {
      const token = localStorage.getItem("token");
  
      const res = await fetch(
        `${BASE_URL}/api/minat-penyedia/kebutuhan/${kebutuhanId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const data = await res.json();
  
      console.log("🔥 RESPONSE PEMINAT:", data);
      console.log("🔥 DATA PEMINAT:", data.data);
  
      setListPeminat(data.data ?? []);
      setShowSetujuProposal(true);
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleApprovePenyedia = (p: PenyediaItem) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch(
    `${BASE_URL}/api/minat-penyedia/${p.minat_id}/approve`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then(() => {
      toast.success("Proposal berhasil disetujui");
      setShowSetujuProposal(false);
      setShowDetailUsulanModal(false);
      fetchUsulan();
    })
    .catch((err) => {
      console.error(err);
      toast.error("Gagal menyetujui proposal");
    });
};




  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarPengguna />
      <div className="flex-1 overflow-y-auto">
        <div className="bg-gradient-to-r from-[#3e81aa] to-[#1F4E73] text-white shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Riwayat Usulan Kebutuhan</h1>
                <p className="text-blue-100 text-sm">Selamat datang pengguna! Lihat Usulanmu</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pt-6 space-y-6">
        <FilterUsulan
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          search={search}
          setSearch={setSearch}
          counts={counts}
        />
        </div>

        {/* LIST USULAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {filteredUsulan.map((u) => (
              <UsulanCard
                key={u.id}
                usulan={u}
                kategoriName={u.nama_kategori}
                onClick={() => {
                  const raw = usulan.find((x) => x.id === u.id);
                  setSelectedRawUsulan(raw!);
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
            onEdit={() => handleEditUsulan(selectedRawUsulan!)}
            onDelete={handleDeleteUsulan}
            onOpenPeminat={() => handleOpenPeminat(selectedUsulan.id)}

          />
        )}

        {/* MODAL EDIT */}
        {editData && selectedUsulan && (
          <EditUsulanModal
            usulan={editData}
            onClose={() => setEditData(null)}
            onSuccess={() => {
              fetchUsulan();
              setEditData(null);
            }}
          />
        )}

        {/* MODAL Setuju proposal */}
        {showSetujuProposal && (
          <SetujuProposal
            show={showSetujuProposal}
            penyedia={listPeminat}
            onClose={() => setShowSetujuProposal(false)}
            onApprove={handleApprovePenyedia}
          />
        )}

      </div>
    </div>
  );
}