import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Post from "./components/post/Post";
import { posts } from "./data/posts";
import "./index.css";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      {posts.map((post, i) => (
        <Post key={i} post={post} />
      ))}
    </StrictMode>,
  );
}
