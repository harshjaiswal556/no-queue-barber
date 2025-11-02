const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const apiClient = async (
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
};
