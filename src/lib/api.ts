const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("flashbook_token");
}

export function setToken(token: string) {
  localStorage.setItem("flashbook_token", token);
}

export function clearToken() {
  localStorage.removeItem("flashbook_token");
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(data.error || "Request failed"), {
      status: res.status,
      data,
    });
  }
  return data;
}

export const api = {
  register: (email: string, password: string) =>
    request("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  listDrops: () => request("/api/drops"),
  getDrop: (id: string) => request(`/api/drops/${id}`),
  createDrop: (body: { name: string; total_slots: number; start_time: string; per_user_limit?: number }) =>
    request("/api/drops", { method: "POST", body: JSON.stringify(body) }),
  setDropStatus: (id: string, status: string) =>
    request(`/api/drops/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  joinQueue: (dropId: string) => request(`/api/drops/${dropId}/queue/join`, { method: "POST" }),
  queueStatus: (dropId: string) => request(`/api/drops/${dropId}/queue/status`),
  book: (dropId: string) => request(`/api/drops/${dropId}/book`, { method: "POST", body: "{}" }),
  pay: (bookingId: string, idempotencyKey: string) =>
    request(`/api/bookings/${bookingId}/pay`, {
      method: "POST",
      body: JSON.stringify({ idempotency_key: idempotencyKey, simulate: "success" }),
    }),
  getBooking: (id: string) => request(`/api/bookings/${id}`),
};
