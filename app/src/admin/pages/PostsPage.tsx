import { useQuery } from "@tanstack/react-query";
import React from "react";
import { parseRawPostSchema } from "shared";

export interface PostsPageProps {
  adminSecret: string;
  onBack: () => void;
}

const PostsPage: React.FC<PostsPageProps> = ({ adminSecret, onBack }) => {
  const { data: posts } = useQuery({
    queryKey: ["admin/posts", adminSecret],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/posts", {
          headers: { "admin-secret": adminSecret },
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
      {posts.map((post) => (
        <div key={post.id} className="admin-card">
          ID: {post.id}
          <br />
          Author: {post.authorName}
          <br />
          Date: {new Date(post.timestamp * 1000).toLocaleDateString()}
          <br />
          Caption: {post.caption ?? "_"}
          <br />
          Media Type: {post.mediaType ?? "_"}
          <br />
          Reactions: {post.reactions}
        </div>
      ))}
    </>
  );
};

export default PostsPage;
