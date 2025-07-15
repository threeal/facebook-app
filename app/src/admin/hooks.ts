import { useQuery } from "@tanstack/react-query";
import { parseRawUsersSchema } from "shared";

export function useRawUsers(adminSecret: string) {
  const { data } = useQuery({
    queryKey: ["admin/users", adminSecret],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/users", {
          headers: { "admin-secret": adminSecret },
        });
        if (!res.ok) throw new Error(res.statusText);
        return parseRawUsersSchema(await res.json());
      } catch (err) {
        console.error("Failed to fetch users:", err);
        throw err;
      }
    },
    initialData: [],
  });
  return data;
}
