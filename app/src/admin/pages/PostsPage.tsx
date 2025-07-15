import { useQuery } from "@tanstack/react-query";
import React from "react";
import { parseRawPostSchema } from "shared";
import { useAdminStore } from "../adminStore";

export interface PostsPageProps {
  onBack: () => void;
}

const PostsPage: React.FC<PostsPageProps> = ({ onBack }) => {
  const { adminSecret } = useAdminStore();
  const { data: posts } = useQuery({
    queryKey: ["admin/posts", adminSecret],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/posts", {
          headers: { "admin-secret": adminSecret ?? "" },
        });
        if (!res.ok) throw new Error(res.statusText);
        return parseRawPostSchema(await res.json());
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        throw err;
      }
    },
    initialData: [],
  });

  return (
    <>
      <h1 className="admin-title">Posts</h1>
      <button className="admin-button" onClick={onBack}>
        Back
      </button>
      {posts.map(({ id, authorName, caption, image, video, reactions }) => (
        <div key={id} className="admin-card">
          ID: {id}
          <br />
          Author: {authorName}
          <br />
          Caption: {caption ?? "_"}
          <br />
          Image: {image ?? "_"}
          <br />
          Video: {video ?? "_"}
          <br />
          Reactions: {reactions}
        </div>
      ))}
    </>
  );
};

export default PostsPage;
