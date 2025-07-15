import React from "react";
import { useQuery } from "@tanstack/react-query";
import { parsePostsSchema } from "shared";
import Post from "./post/Post";

const Timeline: React.FC = () => {
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
      {posts.map((post, i) => (
        <Post key={i} post={post} />
      ))}
    </>
  );
};

export default Timeline;
