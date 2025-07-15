import React from "react";
import { useQuery } from "@tanstack/react-query";
import { parsePostsSchema } from "shared";
import { useAdminStore } from "../admin/adminStore";
import Post from "./post/Post";

const Timeline: React.FC = () => {
  const { adminSecret, showAdminDashboard } = useAdminStore();
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error(res.statusText);
      return parsePostsSchema(await res.json());
    },
    initialData: [],
  });

  return (
    <>
      {adminSecret && (
        <>
          <h1 className="admin-title">Timeline</h1>
          <button className="admin-button" onClick={showAdminDashboard}>
            Admin Dashboard
          </button>
        </>
      )}
      {posts.map((post, i) => (
        <Post key={i} post={post} />
      ))}
    </>
  );
};

export default Timeline;
