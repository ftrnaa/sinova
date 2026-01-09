// src/utils/auth.ts
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.clear(); // hapus semua data login / token / user
};
