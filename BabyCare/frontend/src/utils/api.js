const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://babycare-p37x.onrender.com"
).replace(/\/$/, "");

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
