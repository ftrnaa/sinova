export default function StatsSection() {
  const stats = [
    { number: 108, label: "Uji Coba" },
    { number: 138, label: "Sudah Dipasarkan" },
    { number: 223, label: "Penerapan/Implementasi" },
  ];

  return (
    <section className="bg-white py-12 px-6 flex justify-center border-t border-[#1F4E73]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl text-center">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-[#1F4E73] text-white rounded-2xl py-6 px-4 font-semibold"
          >
            <p className="text-3xl font-bold">{s.number}</p>
            <p className="mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
