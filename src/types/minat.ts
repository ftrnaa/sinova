export interface PenyediaItem {
  minat_id: number;
  kebutuhan_id: number;
  penyedia_id: number;

  nama: string;
  email: string;

  deskripsi: string; // ✅ TAMBAH INI

  proposal_file: string;
  estimasi_biaya?: number | null;
  estimasi_waktu: string | null;

  status: "menunggu" | "diterima" | "ditolak";
  tanggal_minat: string;
}
