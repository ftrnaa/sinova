// src/components/StatItem.tsx
"use client";

import { motion } from "framer-motion";

export default function StatItem({
  title,
  status,
  delay = 0,
}: {
  title: string;
  status?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 mb-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xl">
          💡
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">Ringkasan singkat dari inovasi</p>
        </div>
      </div>
      <div className="text-sm text-sky-600">{status ?? "Sedang Diproses"}</div>
    </motion.div>
  );
}
