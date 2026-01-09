"use client";

import { X, Edit, Trash2, Users, Package, Mail, Phone, MapPin, ArrowRight, FileText, Building } from "lucide-react";
import type { Usulan } from "@/types/usulan";

interface DetailUsulanModalProps {
  usulan: Usulan;
  onClose: () => void;
  onEdit?: (usulan: string) => void;
  onDelete?: (id: number) => void;
  onOpenPeminat?: (kebutuhanId: number) => void;
  onAjukanProposal?: (kebutuhanId: number) => void;
}

export default function DetailUsulanModal({ 
  usulan, 
  onClose, 
  onEdit, 
  onDelete, 
  onOpenPeminat,
  onAjukanProposal,
}: DetailUsulanModalProps) {
  console.log("PEMINAT =", usulan.peminat);
  if (!usulan) return null;

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(/[^\d]/g, '')) : value;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const handleDelete = () => {
    if (window.confirm('Yakin ingin menghapus usulan ini?')) {
      onDelete?.(Number(usulan.id) || 0);
      onClose();
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(DetailUsulanModal.name);
      onClose();
    }
  };

  const handleAjukanProposal = () => {
    if (usulan?.id) {
      onAjukanProposal?.(usulan.id);
    }
  };

  const handleLihatPeminat = () => {
  if (usulan.id && onOpenPeminat) {
    onOpenPeminat(usulan.id);
    onClose(); // 🔥 PENTING
  }
};


  const canSeePeminat = Boolean(onOpenPeminat);

  const hasPeminat = (usulan.peminat ?? 0) > 0;
  const isTersedia = usulan.status === "Tersedia";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header - Minimalis */}
        <div className="bg-gradient-to-r from-[#1F4E73] to-[#2C6698] text-white p-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Detail Usulan Kebutuhan</h2>
            <p className="text-sm text-blue-100 opacity-90">{usulan.jenisProdukanDiusulkan}</p>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Status & Peminat Card */}
          {hasPeminat && onOpenPeminat && (
            <button
              onClick={handleLihatPeminat}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>
                <span className="font-bold">{usulan.peminat}</span> Peminat • Lihat Detail
              </span>
            </button>
          )}


          {/* Deskripsi Kebutuhan */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Package className="w-6 h-6 text-blue-600" />
              Deskripsi Kebutuhan
            </h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {usulan.deskripsiKebutuhan || 'Tidak ada deskripsi'}
              </p>
          </div>

          {/* Grid Info Penting */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Timeline */}
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div>
                  <p className="text-xs text-gray-600">Timeline Penggunaan</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {formatDate(usulan.tanggal)}
                  </p>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div>
                  <p className="text-xs text-gray-600">Estimasi Budget</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {usulan.estimasiBudget ? formatCurrency(usulan.estimasiBudget) : 'Belum ditentukan'}
                  </p>
                </div>
              </div>
            </div>

            {/* kategori */}
            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div>
                  <p className="text-xs text-gray-600">kategori</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {usulan.nama_kategori || usulan.kategori_id || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kontak Person */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
              <Users className="w-6 h-6 text-blue-600" />
              Kontak Person
            </h4>
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Nama Lengkap</p>
                  <p className="font-bold text-gray-900 text-lg">{usulan.nama}</p>
                  <p className="text-sm text-gray-600">{usulan.jabatan || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Perusahaan</p>
                  <p className="font-bold text-gray-900">{usulan.namaPerusahaan || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm text-gray-900">{usulan.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Telepon</p>
                    <p className="text-sm text-gray-900">{usulan.noTelp}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg mt-1">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Alamat Lengkap</p>
                    <p className="text-sm text-gray-900">{usulan.alamat}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Perusahaan */}
          {(usulan.namaPerusahaan || usulan.alamatPerusahaan) && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                <Building className="w-6 h-6 text-blue-600" />
                Detail Perusahaan
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Nama Perusahaan</p>
                  <p className="font-medium text-sm text-gray-900">{usulan.namaPerusahaan || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Email Perusahaan</p>
                  <p className="font-medium text-sm text-gray-900">{usulan.emailPerusahaan || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Telepon Perusahaan</p>
                  <p className="font-medium text-sm text-gray-900">{usulan.noTelpPerusahaan || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Alamat Perusahaan</p>
                  <p className="font-medium text-sm text-gray-900">{usulan.alamatPerusahaan || '-'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Dokumen */}
          {usulan.dokumen && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                <FileText className="w-6 h-6 text-blue-600" />
                Dokumen Pendukung
              </h4>
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-white border border-blue-200 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{usulan.dokumen}</p>
                    <p className="text-sm text-gray-600">Klik untuk mengunduh</p>
                  </div>
                </div>
                <a
                  href={`http://localhost:5000/uploads/${usulan.dokumen}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download
                </a>
              </div>
            </div>
          )}
        

        {/* Footer Buttons - Semua Button Tetap Ada */}
        <div className="border-t bg-gray-50 pt-4">
          <div className="flex justify-end gap-2">
            
            {/* Left Side: Info & Peminat */}
            <div className="flex flex-wrap gap-3">
              {hasPeminat && canSeePeminat && (
                <button
                  onClick={handleLihatPeminat}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    <span className="font-bold">{usulan.peminat}</span> Peminat • Lihat Detail
                  </span>
                </button>
              )}
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-end">
              {/* AJUKAN PROPOSAL Button */}
              {isTersedia && onAjukanProposal && (
            <button 
              onClick={handleAjukanProposal}
              className="px-4 py-2 bg-gradient-to-r from-[#3e81aa] to-[#1F4E73] text-white rounded font-bold hover:shadow-xl transition-all flex items-center gap-2">
              Ajukan Proposal
              <ArrowRight className="w-5 h-5" />
            </button>
          )}


              {/* EDIT Button */}
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}

              {/* HAPUS Button */}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              )}

              {/* BATAL/TUTUP Button */}
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded hover:bg-gray-300 transition-all font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}