"use client";

import { useState } from "react";
import { X, Upload, Send } from "lucide-react";

interface SelectedUsulan {
  id: string | number;
  jenisProdukanDiusulkan: string;
  namaPerusahaan: string;
}

interface Props {
  show: boolean;
  onClose: () => void;
  selectedUsulan: SelectedUsulan;
  onSuccess?: (kebutuhan_id: string | number, file: File, deskripsi?: string) => void;
}

export default function MinatPenyediaModal({ show, onClose, selectedUsulan, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [proposalData, setProposalData] = useState({
    deskripsi: "",
    file: null as File | null,
  });

  if (!show || !selectedUsulan) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProposalData({ ...proposalData, file: e.target.files[0] });
    }
  };

  const kirimProposal = async () => {
    if (!proposalData.file) {
      alert("Silakan upload file proposal!");
      return;
    }

    try {
      setLoading(true);
      await onSuccess?.(selectedUsulan.id, proposalData.file, proposalData.deskripsi || "");
      setProposalData({ file: null, deskripsi: "" });
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan";
      alert("❌ " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#3e81aa] to-[#1F4E73] text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ajukan Proposal</h2>
              <p className="text-green-100">{selectedUsulan.jenisProdukanDiusulkan}</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm text-gray-700">
              Isi form di bawah untuk mengajukan proposal Anda untuk proyek dari{" "}
              <strong>{selectedUsulan.namaPerusahaan}</strong>
            </p>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Deskripsi Proposal
            </label>
            <textarea
              rows={5}
              value={proposalData.deskripsi}
              placeholder="Jelaskan proposal Anda secara singkat"
              onChange={(e) =>
                setProposalData({ ...proposalData, deskripsi: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1F4E73]"
            />
          </div>

          {/* File */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload File Proposal <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                {proposalData.file ? (
                  <p className="text-blue-600 font-medium">{proposalData.file.name}</p>
                ) : (
                  <p className="text-gray-600">Klik untuk upload PDF / DOC / DOCX</p>
                )}
              </label>
            </div>
          </div>

          {/* ACTION */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={kirimProposal}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#3e81aa] to-[#1F4E73] text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Send className="w-5 h-5" />
              {loading ? "Mengirim..." : "Kirim Proposal"}
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
