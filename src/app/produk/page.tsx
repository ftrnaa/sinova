// produk/page.tsx

'use client';

import { useEffect, useState } from 'react';

// 1. 💡 DEFINISI TIPE (INTERFACE)
// Ini memberi tahu TypeScript struktur data produk yang diharapkan dari API.
interface Produk {
  id: number; // Sesuaikan dengan tipe data ID yang sebenarnya (number atau string)
  nama_produk: string;
  // Jika ada properti lain yang dikembalikan API, definisikan di sini
  // Misalnya: harga: number;
}

export default function ProdukPage() {
  // 2. 💡 PENERAPAN TIPE PADA STATE
  // setProduk sekarang hanya menerima array dari objek yang bertipe Produk (Produk[])
  const [produk, setProduk] = useState<Produk[]>([]);

  useEffect(() => {
    fetch("http://localhost:4001/produk")
      .then(res => res.json())
      .then((data: Produk[]) => { // Opsional: Mendefinisikan tipe data yang diterima dari JSON
        setProduk(data);
      })
      .catch(error => {
        // Penanganan error tambahan jika gagal fetch
        console.error("Gagal mengambil data produk:", error);
      });
  }, []);

  return (
    <div>
      <h1>List Produk</h1>
      <ul>
        {/* 3. ✅ FIX: p sekarang dikenali sebagai tipe Produk, 
             sehingga p.id dan p.nama_produk tidak lagi merah. */}
        {produk.map((p) => (
          <li key={p.id}>
            {p.nama_produk} (ID: {p.id})
          </li>
        ))}
      </ul>
      {/* Tampilkan pesan jika data kosong */}
      {produk.length === 0 && <p>Memuat produk atau data tidak ditemukan...</p>}
    </div>
  );
}