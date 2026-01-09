"use client";

import React from "react";
import { Download } from "lucide-react";
import Navbar from "../../components/ui/navbar";
import Footer from "@/components/ui/footer";

export default function Info() {
  const currentItems = [
    { id: 1, title: "Manual Book Sinova Kepulauan Riau (Publik)" },
    { id: 2, title: "Manual Book Sinova Kepulauan Riau (Peneliti)" },
  ];

  const fileMap: Record<number, string> = {
    1: "/Manual Book Pengguna Inovasi Aplikasi SINOVA.pdf",
    2: "/Manual Book Penyedia Inovasi Aplikasi SINOVA.pdf",
  };

  const handleDownload = (id: number) => {
    const fileUrl = fileMap[id];

    if (!fileUrl) {
      alert("File belum tersedia");
      return;
    }

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop() || "file.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
              📚 Dokumentasi & Panduan
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Panduan Penggunaan SINOVA
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Akses panduan lengkap untuk menggunakan platform SINOVA secara optimal
            </p>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#1F4E73] to-[#3e81aa] text-white">
                    <th className="py-4 px-6 text-left font-semibold text-base rounded-tl-lg w-20">
                      No.
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-base">
                      Judul Panduan
                    </th>
                    <th className="py-4 px-6 text-center font-semibold text-base rounded-tr-lg w-48">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-6 text-gray-800 font-medium">
                        {index + 1}.
                      </td>
                      <td className="py-4 px-6 text-gray-800">
                        {item.title}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleDownload(item.id)}
                          className="inline-flex items-center gap-2 bg-[#1F4E73] hover:bg-[#163d5a] text-white px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
                        >
                          <Download size={16} />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-gray-500">
                        Tidak ada panduan tersedia
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
