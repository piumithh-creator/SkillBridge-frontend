import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import type { ApiEnvelope, AuthUser, Paginated } from "../types";

export const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
const ASSET_URL = API_URL.replace(/\/api\/?$/, "");

/** Access token lives only in memory (never localStorage) → not readable by injected scripts after a reload. */
let accessToken: string | null = null;
export const setAccessToken = (token: string | null): void => { accessToken = token; };

export const assetUrl = (path?: string | null): string | undefined =>
  !path ? undefined : path.startsWith("http") ? path : `${ASSET_URL}${path}`;

const AUTH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];
const isAuthPath = (url?: string): boolean => AUTH_PATHS.some((p) => url?.includes(p));

const api = axios.create({ baseURL: API_URL, withCredentials: true });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken && !isAuthPath(config.url)) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

interface RefreshResult { accessToken: string; user: AuthUser }
let refreshPromise: Promise<RefreshResult> | null = null;

/** Single-flight refresh: concurrent 401s share one refresh request (cookie rotation would break otherwise). */
export const refreshSession = (): Promise<RefreshResult> => {
  refreshPromise ??= axios
    .post<ApiEnvelope<RefreshResult>>(`${API_URL}/auth/refresh`, null, { withCredentials: true })
    .then((r) => {
      setAccessToken(r.data.data.accessToken);
      return r.data.data;
    })
    .finally(() => { refreshPromise = null; });
  return refreshPromise;
};

type RetriableConfig = AxiosRequestConfig & { _retried?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    if (error.response?.status === 401 && original && !original._retried && !isAuthPath(original.url)) {
      original._retried = true;
      try {
        const { accessToken: token } = await refreshSession();
        original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
        return api(original);
      } catch {
        setAccessToken(null);
        window.dispatchEvent(new Event("auth:expired"));
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (err: unknown, fallback = "Something went wrong"): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; errors?: { field: string; message: string }[] } | undefined;
    const first = data?.errors?.[0];
    if (first) return `${first.field ? first.field + ": " : ""}${first.message}`;
    if (data?.message) return data.message;
    if (!err.response) return "Cannot reach the server. Check your connection.";
  }
  return err instanceof Error ? err.message : fallback;
};

export const unwrap = async <T>(p: Promise<{ data: ApiEnvelope<T> }>): Promise<T> => (await p).data.data;

export const unwrapPage = async <T>(p: Promise<{ data: ApiEnvelope<T[]> }>): Promise<Paginated<T>> => {
  const { data } = await p;
  return { items: data.data, meta: data.meta ?? { total: data.data.length, page: 1, limit: data.data.length, totalPages: 1 } };
};

export const downloadBlob = async (url: string, fallbackName: string): Promise<void> => {
  const res = await api.get<Blob>(url, { responseType: "blob" });
  const disposition = String(res.headers["content-disposition"] ?? "");
  const name = /filename="?([^";]+)"?/.exec(disposition)?.[1] ?? fallbackName;
  const href = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
};

export default api;
