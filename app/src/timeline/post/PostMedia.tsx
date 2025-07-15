import React, { useRef, useState } from "react";
import { InView } from "react-intersection-observer";
import PageVisibility from "react-page-visibility";
import MuteIcon from "./icons/MuteIcon";
import UnmuteIcon from "./icons/UnmuteIcon";
import "./PostMedia.css";

interface PostMediaVideoProps {
  postId: number;
}

const PostMediaVideo: React.FC<PostMediaVideoProps> = ({ postId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef<boolean>(false);

  const [isMuted, setIsMuted] = useState(true);

  const onMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const onInViewChange = (inView: boolean) => {
    inViewRef.current = inView;
    if (videoRef.current) {
      if (inView) {
        videoRef.current.currentTime = 0;
        void videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const onVisibilityChange = (visible: boolean) => {
    if (videoRef.current) {
      if (visible && inViewRef.current) {
        videoRef.current.currentTime = 0;
        void videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <InView onChange={onInViewChange} className="post-media-video">
      <PageVisibility onChange={onVisibilityChange} />
      <video
        ref={videoRef}
        src={`/static/posts/medias/${postId.toString()}/390.webm`}
        loop
        muted={isMuted}
        controls={false}
        playsInline
      />
      <button className="post-media-video-mute-button" onClick={onMuteToggle}>
        {isMuted ? (
          <MuteIcon className="post-media-video-mute-icon" />
        ) : (
          <UnmuteIcon className="post-media-video-mute-icon" />
        )}
      </button>
    </InView>
  );
};

export interface PostMediaProps {
  postId: number;
  mediaType: "image" | "video";
}

const PostMedia: React.FC<PostMediaProps> = ({ postId, mediaType }) => {
  switch (mediaType) {
    case "image":
      return (
        <div className="post-media-image">
          <img src={`/static/posts/medias/${postId.toString()}/390.webp`} />
        </div>
      );

    case "video":
      return <PostMediaVideo postId={postId} />;
  }
};

export default PostMedia;
