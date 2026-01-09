export const getUsulan = async () => {
  const res = await fetch("http://localhost:3000/kebutuhan", { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal mengambil data usulan");
  return res.json();
};

export const getPenyediaByUsulan = async (id: number) => {
  const res = await fetch(`http://localhost:3000/kebutuhan/${id}/minat`, { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal mengambil penyedia minat");
  const payload = await res.json();
  // payload format: { success: true, total, data }
  return payload.data ?? [];
};

export const deleteUsulan = async (id: number) => {
  const res = await fetch(`http://localhost:5000/api/kebutuhan/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Gagal hapus usulan");
  }

  return res.json();
};

