import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import type { PostData } from "shared";
import Post from "./components/post/Post";
import "./index.css";

const root = document.getElementById("root");
if (root) {
  const res = await fetch("/api/posts");
  const posts = (await res.json()) as PostData[];

  createRoot(root).render(
    <StrictMode>
      {posts.map((post, i) => (
        <Post key={i} post={post} />
      ))}
    </StrictMode>,
  );
}
