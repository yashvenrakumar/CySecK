import axios from "axios";
import type { Role } from "../types";
import { API_PREFIX } from "../config/env";

export const api = axios.create({
  baseURL: API_PREFIX,
});

export const withRole = (role: Role) => ({
  headers: { "x-role": role },
});
