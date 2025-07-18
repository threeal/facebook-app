import React, { useRef, useState } from "react";
import { InView } from "react-intersection-observer";
import PageVisibility from "react-page-visibility";
import MuteIcon from "./icons/MuteIcon";
import UnmuteIcon from "./icons/UnmuteIcon";
import "./PostMedia.css";

interface PostMediaVideoProps {
  id: string;
}

const PostMediaVideo: React.FC<PostMediaVideoProps> = ({ id }) => {
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
        src={`/static/posts/medias/${id}/390.webm`}
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
  id: string;
  mediaType: "image" | "video";
}

const PostMedia: React.FC<PostMediaProps> = ({ id, mediaType }) => {
  switch (mediaType) {
    case "image":
      return (
        <div className="post-media-image">
          <img src={`/static/posts/medias/${id}/390.webp`} />
        </div>
      );

    case "video":
      return <PostMediaVideo id={id} />;
  }
};

export default PostMedia;
