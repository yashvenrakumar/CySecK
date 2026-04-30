import type { Role } from "../types";
import { API_PREFIX } from "../config/env";

type ExtraFetchOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
};

// thrown when response not ok so pages can catch
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

function fullUrl(path: string, params?: Record<string, string>) {
  const u = new URL(`${API_PREFIX}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (typeof v === "string") u.searchParams.set(k, v);
    }
  }
  return u.toString();
}

async function doRequest<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
  options?: ExtraFetchOptions,
): Promise<{ data: T }> {
  const res = await fetch(fullUrl(path, options?.params), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) {
    throw new ApiError(json?.message || `Request failed (${res.status})`, res.status, json);
  }
  return { data: json as T };
}

// thin wrapper around fetch — returns { data } where data is parsed json body
export const api = {
  get: <T>(path: string, options?: ExtraFetchOptions) => doRequest<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: ExtraFetchOptions) => doRequest<T>("POST", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: ExtraFetchOptions) => doRequest<T>("PATCH", path, body, options),
  delete: <T>(path: string, options?: ExtraFetchOptions) => doRequest<T>("DELETE", path, undefined, options),
};

export function withRole(role: Role) {
  return { headers: { "x-role": role } };
}
