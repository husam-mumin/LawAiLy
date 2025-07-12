// utils/refresh.ts
export async function silentRefresh() {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      return data.accessToken;
    }
  } catch (e) {
    console.error("Failed to refresh token", e);
  }
}
