import type { Role } from "../types";
import { API_PREFIX } from "../config/env";

type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const buildUrl = (path: string, params?: Record<string, string>) => {
  const url = new URL(`${API_PREFIX}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === "string") url.searchParams.set(key, value);
    });
  }
  return url.toString();
};

const request = async <T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<{ data: T }> => {
  const res = await fetch(buildUrl(path, options?.params), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const raw = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) {
    throw new ApiError(raw?.message || `Request failed (${res.status})`, res.status, raw);
  }
  return { data: raw as T };
};

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("POST", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("PATCH", path, body, options),
  delete: <T>(path: string, options?: RequestOptions) => request<T>("DELETE", path, undefined, options),
};

export const withRole = (role: Role) => ({
  headers: { "x-role": role },
});
