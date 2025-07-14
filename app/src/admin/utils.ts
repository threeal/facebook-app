export async function verifyAdmin(): Promise<boolean> {
  try {
    const params = new URLSearchParams(window.location.search);
    const adminSecret = params.get("admin-secret");
    if (!adminSecret) return false;

    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "admin-secret": adminSecret },
      body: null,
    });
    if (!res.ok) throw new Error(res.statusText);
    return true;
  } catch (err) {
    console.error("Failed to verify admin:", err);
    return false;
  }
}
