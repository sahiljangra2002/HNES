import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hnes_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      window.location.pathname.startsWith("/admin") &&
      window.location.pathname !== "/admin"
    ) {
      localStorage.removeItem("hnes_token");
      localStorage.removeItem("hnes_admin");
      window.location.href = "/admin";
    }
    return Promise.reject(err);
  }
);

export const resolveImg = (url) =>
  url && url.startsWith("/api") ? `${BACKEND_URL}${url}` : url;

export const isLoggedIn = () => Boolean(localStorage.getItem("hnes_token"));

export const logout = () => {
  localStorage.removeItem("hnes_token");
  localStorage.removeItem("hnes_admin");
};

export const formatDate = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

export const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
