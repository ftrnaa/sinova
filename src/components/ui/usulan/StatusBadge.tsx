import { CheckCircle, Lock } from "lucide-react";

export default function StatusBadge({ status }: { status: string }) {
  if (status === "Sedang Dikerjakan") {
    return (
      <span className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded-full text-xs font-semibold flex items-center gap-1">
        <Lock className="w-3 h-3" />
        Sedang Dikerjakan
      </span>
    );
  }

  return (
    <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-300 rounded-full text-xs font-semibold flex items-center gap-1">
      <CheckCircle className="w-3 h-3" />
      Tersedia
    </span>
  );
}
