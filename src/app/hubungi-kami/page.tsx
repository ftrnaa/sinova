"use client";

import React from "react";
import Navbar from '../../components/ui/navbar';
import Footer from "@/components/ui/footer";

export default function HubungiKamiPage() {
  const handleMapClick = () => {
    // Koordinat dari Plus Code VCHW+22F
    const latitude = 0.8700625;
    const longitude = 104.4450625;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank");
  };

  const cards = [
    {
      title: "Alamat",
      content: (
        <>
          VCHW+22F<br />
          Dompak, Kec. Bukit Bestari<br />
          Kota Tanjung Pinang<br />
          Kepulauan Riau 29124
        </>
      ),
      icon: (
        <>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </>
      ),
      delay: "0.6s",
    },
    {
      title: "Kontak",
      content: (
        <a href="tel:08116945679" className="hover:underline">
          0811-6945-679
        </a>
      ),
      icon: (
        <>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.11 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.8 12.8 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.8 12.8 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </>
      ),
      delay: "0.8s",
    },
    {
      title: "Jam Operasional",
      content: (
        <>
          Senin - Kamis : 07.00 - 15.30 WIB <br />
          Jumat : 07.00 - 14.00 WIB
        </>
      ),
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </>
      ),
      delay: "1s",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white flex flex-col items-center px-4 sm:px-6 lg:px-10 py-8">
        
       {/* MAP */}
<div
  className="w-full max-w-7xl mb-10"
  style={{ animation: "fadeIn 1s ease-in" }}
>
  <div className="relative transition-all duration-300 hover:scale-[1.01] hover:shadow-xl cursor-pointer group rounded-lg">

    <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[450px]">
      <iframe
        title="Dompak, Tanjung Pinang"
        src="https://www.openstreetmap.org/export/embed.html?bbox=104.4350%2C0.8600%2C104.4550%2C0.8800&layer=mapnik&marker=0.8700625,104.4450625"
        className="w-full h-full rounded-lg border-2 border-[#1F4E73] shadow-lg pointer-events-none"
      />
    </div>

    {/* Overlay yang tetap transparan (tidak gelap) saat hover */}
    <div
      onClick={handleMapClick}
      className="absolute inset-0 rounded-lg flex items-center justify-center bg-transparent transition-all duration-300"
    >
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 px-6 py-3 rounded-full shadow-lg">
        <p className="text-[#1F4E73] font-semibold flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Buka di Google Maps
        </p>
      </div>
    </div>
  </div>
</div>

        {/* CARDS */}
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-[#1F4E73] text-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center"
              style={{ animation: `slideUp ${card.delay} ease-out` }}
            >
              <div className="flex justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {card.icon}
                </svg>
              </div>

              <h2 className="text-lg font-semibold mb-2">{card.title}</h2>
              <p className="text-sm leading-relaxed">{card.content}</p>
            </div>
          ))}

        </div>
      </div>

      <Footer />
    </>
  );
}