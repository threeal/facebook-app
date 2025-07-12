import React, { useRef, useState } from "react";
import { InView } from "react-intersection-observer";
import MuteIcon from "./MuteIcon";
import UnmuteIcon from "./UnmuteIcon";
import "./PostVideoContent.css";

export interface PostVideoContentProps {
  video: string;
}

const PostVideoContent: React.FC<PostVideoContentProps> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(true);

  const onMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const onInViewChange = (inView: boolean) => {
    if (videoRef.current) {
      if (inView) {
        videoRef.current.currentTime = 0;
        void videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <InView onChange={onInViewChange} className="post-video">
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
