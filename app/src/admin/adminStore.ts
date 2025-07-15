import { create } from "zustand";

interface AdminStore {
  adminSecret: string | null;
  isAdminDashboardVisible: boolean;
  clearAdminSecret: () => void;
  showAdminDashboard: () => void;
  hideAdminDashboard: () => void;
}

async function verifyAdminSecret(secret: string): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "admin-secret": secret },
    });
    if (!res.ok) throw new Error(res.statusText);
    return true;
  } catch (err) {
    console.error("Failed to verify admin secret:", err);
    return false;
  }
}

export const useAdminStore = create<AdminStore>((set) => ({
  adminSecret: (() => {
    const params = new URLSearchParams(window.location.search);
    const secret = params.get("admin-secret");
    if (secret) {
      void verifyAdminSecret(secret).then((verified) => {
        if (verified) {
          localStorage.setItem("adminSecret", secret);
          set({ adminSecret: secret });
        }
      });
    } else {
      const secret = localStorage.getItem("adminSecret");
      if (secret) {
        void verifyAdminSecret(secret).then((verified) => {
          if (verified) set({ adminSecret: secret });
        });
      }
    }
    return null;
  })(),
  isAdminDashboardVisible: false,
  clearAdminSecret: () => {
    localStorage.removeItem("adminSecret");
    set({ adminSecret: null, isAdminDashboardVisible: false });
  },
  showAdminDashboard: () => {
    localStorage.removeItem("adminSecret");
    set({ isAdminDashboardVisible: true });
  },
  hideAdminDashboard: () => {
    localStorage.removeItem("adminSecret");
    set({ isAdminDashboardVisible: false });
  },
}));
