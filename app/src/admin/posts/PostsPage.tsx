import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { parseRawPostSchema } from "shared";
import CreatePostPage from "./CreatePostPage";

type Page = "main" | "create";

interface PostCardsProps {
  adminSecret: string;
}

const PostCards: React.FC<PostCardsProps> = ({ adminSecret }) => {
  const { data: posts } = useQuery({
    queryKey: ["admin/posts", adminSecret],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/posts", {
          headers: { "admin-secret": adminSecret },
        });
        if (!res.ok) throw new Error(res.statusText);
        const posts = parseRawPostSchema(await res.json());
        return posts.sort((a, b) => a.timestamp - b.timestamp);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        throw err;
      }
    },
    initialData: [],
  });

  return (
    <>
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

export interface PostsPageProps {
  adminSecret: string;
  onBack: () => void;
}

const PostsPage: React.FC<PostsPageProps> = ({ adminSecret, onBack }) => {
  const [page, setPage] = useState<Page>("main");

  switch (page) {
    case "main":
      return (
        <>
          <h1 className="admin-title">Posts</h1>
          <button className="admin-button" onClick={onBack}>
            Back
          </button>
          <button
            className="admin-button"
            onClick={() => {
              setPage("create");
            }}
          >
            Create Post
          </button>
          <PostCards adminSecret={adminSecret} />
        </>
      );

    case "create":
      return (
        <CreatePostPage
          adminSecret={adminSecret}
          onBack={() => {
            setPage("main");
          }}
        />
      );
  }
};

export default PostsPage;
