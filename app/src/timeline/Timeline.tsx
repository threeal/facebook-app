import React from "react";
import { useQuery } from "@tanstack/react-query";
import { parsePosts } from "shared";
import Post from "./post/Post";

interface TimeLineProps {
  isAdminModeEnabled: boolean;
  onAdminDashboardSwitch: () => void;
}

const Timeline: React.FC<TimeLineProps> = ({
  isAdminModeEnabled,
  onAdminDashboardSwitch,
}) => {
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error(res.statusText);
      const posts = parsePosts(await res.json());
      return posts.sort((a, b) => a.timestamp - b.timestamp);
    },
    initialData: [],
  });

  return (
    <>
      {isAdminModeEnabled && (
        <>
          <h1 className="admin-title">Timeline</h1>
          <button className="admin-button" onClick={onAdminDashboardSwitch}>
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
