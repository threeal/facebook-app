import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { postSchema } from "shared";
import * as v from "valibot";
import Post from "./components/post/Post";
import "./index.css";

const root = document.getElementById("root");
if (root) {
  const res = await fetch("/api/posts");
  const posts = v.parse(v.array(postSchema), await res.json());

  createRoot(root).render(
    <StrictMode>
      {posts.map((post, i) => (
        <Post key={i} post={post} />
      ))}
    </StrictMode>,
  );
}
