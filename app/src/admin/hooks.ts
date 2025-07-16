import { useQuery } from "@tanstack/react-query";
import { parseAdminUsersSchema } from "shared";

export function useAdminUsers(adminSecret: string) {
  const { data } = useQuery({
    queryKey: ["admin/users", adminSecret],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/users", {
          headers: { "admin-secret": adminSecret },
        });
        if (!res.ok) throw new Error(res.statusText);
        return parseAdminUsersSchema(await res.json());
      } catch (err) {
        console.error("Failed to fetch users:", err);
        throw err;
      }
    },
    initialData: [],
  });
  return data;
}
