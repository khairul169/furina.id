//

export const BASE_URL = "/api";

export const api = async <T = any>(path: string, init: RequestInit = {}) => {
  const res = await fetch(BASE_URL + path, { ...init, credentials: "include" });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message = data?.message || res.statusText;
    throw new Error(message);
  }

  try {
    const data = (await res.json()) as T;
    return data;
  } catch (err) {
    throw new Error("Invalid response");
  }
};
