interface InovasiCardProps {
  title: string;
  desc: string;
  image: string;
}

export default function InovasiCard({ title, desc, image }: InovasiCardProps) {
  return (
    <div className="bg-[#1F4E73] text-white rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row gap-4 p-4 md:p-6">
      <img
        src={image}
        alt={title}
        className="w-full md:w-1/3 h-48 object-cover rounded-xl"
      />
      <div className="flex flex-col justify-between md:w-2/3">
        <div>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-sm opacity-90">{desc}</p>
        </div>
        <button className="mt-4 bg-white text-[#1F4E73] font-semibold px-4 py-2 rounded-md w-max hover:bg-gray-100 transition">
          Lihat Detail
        </button>
      </div>
    </div>
  );
}
