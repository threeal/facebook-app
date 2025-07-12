import React, { useRef, useState } from "react";
import { InView } from "react-intersection-observer";
import PageVisibility from "react-page-visibility";
import MuteIcon from "./MuteIcon";
import UnmuteIcon from "./UnmuteIcon";
import "./PostVideoContent.css";

export interface PostVideoContentProps {
  video: string;
}

const PostVideoContent: React.FC<PostVideoContentProps> = ({ video }) => {
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
    <InView onChange={onInViewChange} className="post-video">
      <PageVisibility onChange={onVisibilityChange} />
      <video
        ref={videoRef}
        src={video}
        loop
        muted={isMuted}
        controls={false}
        playsInline
      />
      <button className="post-video-mute-button" onClick={onMuteToggle}>
        {isMuted ? (
          <MuteIcon className="post-video-mute-icon" />
        ) : (
          <UnmuteIcon className="post-video-mute-icon" />
        )}
      </button>
    </InView>
  );
};

export default PostVideoContent;
