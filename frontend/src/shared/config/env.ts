/**
 * Backend base URL from `.env` (`VITE_API_BASE_URL`).
 * API calls use `${API_BASE_URL}/api/...`.
 */
const raw = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = (typeof raw === "string" && raw.length > 0 ? raw : "http://localhost:4000").replace(
  /\/$/,
  "",
);

/** Axios base path for all REST resources */
export const API_PREFIX = `${API_BASE_URL}/api`;
