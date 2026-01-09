"use client";

import { X, FileText, CheckCircle, Calendar, Mail, Clock, DollarSign } from "lucide-react";
import type { PenyediaItem } from "@/types/minat";

interface Props {
  show: boolean;
  penyedia: PenyediaItem[];
  onClose: () => void;
  onApprove: (p: PenyediaItem) => void;
}

export default function SetujuProposal({
  show,
  penyedia = [],
  onClose,
  onApprove,
}: Props) {

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 bg-[#1F4E73] text-white sticky top-0 z-10">
          <h2 className="font-bold text-lg">Penyedia Minat</h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)] bg-gray-50">
          {penyedia.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-700 text-lg mb-2">Belum Ada Proposal</h3>
              <p className="text-gray-500">
                Belum ada penyedia yang mengajukan proposal untuk kebutuhan ini.
              </p>
            </div>
          ) : (
            penyedia.map((p) => (
              <div
                key={p.minat_id}
                className="bg-white border border-gray-200 rounded-2xl hover:shadow-2xl hover:border-blue-300 transition-all duration-300 overflow-hidden group"
              >
                {/* HEADER CARD */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                        {p.nama.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xl text-gray-800 mb-1.5">{p.nama}</h4>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span className="truncate">{p.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Calendar className="w-4 h-4 text-green-500" />
                            <span>{new Date(p.tanggal_minat).toLocaleDateString("id-ID", {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                      p.status?.toLowerCase() === "menunggu" 
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                        : "bg-green-100 text-green-700 border border-green-300"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>

                {/* BODY CARD */}
                <div className="p-6 space-y-4">
                  {/* DESKRIPSI */}
                  <div>
                    <h5 className="flex items-center gap-2 font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Deskripsi Proposal
                    </h5>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200 whitespace-pre-line">
                      {p.deskripsi}
                    </p>
                  </div>

                  {/* ESTIMASI */}
                  {(p.estimasi_biaya || p.estimasi_waktu) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {p.estimasi_biaya && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                          <div className="flex items-center gap-2 text-green-700 mb-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wide">Estimasi Biaya</span>
                          </div>
                          <p className="text-lg font-bold text-green-800">{p.estimasi_biaya}</p>
                        </div>
                      )}
                      {p.estimasi_waktu && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                          <div className="flex items-center gap-2 text-purple-700 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wide">Estimasi Waktu</span>
                          </div>
                          <p className="text-lg font-bold text-purple-800">{p.estimasi_waktu}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {/* FILE */}
                    {p.proposal_file && (
                      <a
                        href={`http://localhost:5000/uploads/proposal/${p.proposal_file}`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 border border-gray-300 hover:border-gray-400 hover:shadow-md"
                      >
                        <FileText className="w-5 h-5" />
                        <span>Lihat File Proposal</span>
                      </a>
                    )}

                    {/* APPROVE */}
                    {p.status?.toLowerCase() === "menunggu" && (
                      <button
                        onClick={() => onApprove(p)}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#3e81aa] to-[#1F4E73] text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Setujui Proposal</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
