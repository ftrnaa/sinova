"use client";

import { X, FileText, Check, XCircle } from "lucide-react";

interface Peminat {
  id: number;
  nama_instansi: string;
  email: string;
  telp: string;
  deskripsi_proposal: string;
  file_proposal: string;
  status: string;
}

interface Props {
  show: boolean;
  onClose: () => void;
  peminat: Peminat[];
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

export default function PeminatListModal({
  show,
  onClose,
  peminat,
  onApprove,
  onReject,
}: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#1F4E73] to-[#3e81aa] text-white p-5 flex justify-between">
          <h2 className="text-xl font-bold">Daftar Peminat</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {peminat.length === 0 && (
            <p className="text-gray-500 text-center">
              Belum ada penyedia yang berminat
            </p>
          )}

          {peminat.map((p) => (
            <div
              key={p.id}
              className="border rounded-xl p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold">{p.nama_instansi}</h4>
                  <p className="text-sm text-gray-600">{p.email}</p>
                  <p className="text-sm text-gray-600">{p.telp}</p>
                </div>

                <span className="text-sm px-3 py-1 rounded-full bg-gray-100">
                  {p.status}
                </span>
              </div>

              <p className="text-gray-700 text-sm">
                {p.deskripsi_proposal}
              </p>

              <div className="flex gap-3 pt-2">
                <a
                  href={`http://localhost:5000/uploads/${p.file_proposal}`}
                  target="_blank"
                  className="flex items-center gap-2 text-blue-600 text-sm"
                >
                  <FileText size={16} /> Lihat Proposal
                </a>

                {p.status === "pending" && (
                  <>
                    <button
                      onClick={() => onApprove?.(p.id)}
                      className="flex items-center gap-1 text-green-600 text-sm"
                    >
                      <Check size={16} /> Approve
                    </button>
                    <button
                      onClick={() => onReject?.(p.id)}
                      className="flex items-center gap-1 text-red-600 text-sm"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
