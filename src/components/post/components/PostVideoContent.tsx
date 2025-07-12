import React, { useState } from "react";
import MuteIcon from "./MuteIcon";
import UnmuteIcon from "./UnmuteIcon";
import "./PostVideoContent.css";

export interface PostVideoContentProps {
  video: string;
}

const PostVideoContent: React.FC<PostVideoContentProps> = ({ video }) => {
  const [isMuted, setIsMuted] = useState(true);

  const onMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="post-video">
      <video
        src={video}
        autoPlay
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
    </div>
  );
};

export default PostVideoContent;
