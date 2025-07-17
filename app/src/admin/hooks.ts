import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import {
  parseAdminSubmitPost,
  parseAdminUsers,
  type AdminSubmitPostInput,
} from "shared";

export function useParseAdminSubmitPost() {
  const [authorId, setAuthorId] = useState(-1);
  const [timestamp, setTimestamp] = useState(-1);
  const [caption, setCaption] = useState("");
  const [reactions, setReactions] = useState(0);

  const post = useMemo(() => {
    try {
      const input: AdminSubmitPostInput = {
        authorId,
        timestamp,
        caption,
        reactions,
      };
      return parseAdminSubmitPost(input);
    } catch {
      return null;
    }
  }, [authorId, timestamp, caption, reactions]);

  return { post, setAuthorId, setTimestamp, setCaption, setReactions };
}

export function useAdminUsers(adminSecret: string) {
  const { data } = useQuery({
    queryKey: ["admin/users", adminSecret],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/users", {
          headers: { "admin-secret": adminSecret },
        });
        if (!res.ok) throw new Error(res.statusText);
        return parseAdminUsers(await res.json());
      } catch (err) {
        console.error("Failed to fetch users:", err);
        throw err;
      }
    },
    initialData: [],
  });
  return data;
}
