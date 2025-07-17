import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { parseAdminPosts } from "shared";
import CreatePostPage from "./CreatePostPage";
import PostDetailsPage from "./PostDetailsPage";

type Page = "main" | "create" | number;

interface PostCardsProps {
  adminSecret: string;
  onPostClick: (id: number) => void;
}

const PostCards: React.FC<PostCardsProps> = ({ adminSecret, onPostClick }) => {
  const { data: posts } = useQuery({
    queryKey: ["admin/posts", adminSecret],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/posts", {
          headers: { "admin-secret": adminSecret },
        });
        if (!res.ok) throw new Error(res.statusText);
        const posts = parseAdminPosts(await res.json());
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
        <div
          key={post.id}
          className="admin-card"
          onClick={() => {
            onPostClick(post.id);
          }}
        >
          ID: {post.id}
          <br />
          Author: {post.authorName}
          <br />
          Date: {new Date(post.timestamp * 1000).toLocaleDateString()}
          <br />
          Caption: {post.caption !== "" ? post.caption : "_"}
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
          <PostCards
            adminSecret={adminSecret}
            onPostClick={(id) => {
              setPage(id);
            }}
          />
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

    default:
      return (
        <PostDetailsPage
          id={page}
          adminSecret={adminSecret}
          onBack={() => {
            setPage("main");
          }}
        />
      );
  }
};

export default PostsPage;
