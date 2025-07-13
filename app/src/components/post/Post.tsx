import React, { useState } from "react";
import type { PostSchema } from "shared";
import CommentIcon from "./assets/comment-icon.png";
import LikeIcon from "./assets/like-icon.png";
import LikeSolidIcon from "./assets/like-solid-icon.png";
import SendIcon from "./assets/send-icon.png";
import ShareIcon from "./assets/share-icon.png";
import CloseIcon from "./components/CloseIcon";
import DetailsIcon from "./components/DetailsIcon";
import PostVideoContent from "./components/PostVideoContent";
import ReactionIcon from "./components/ReactionIcon";
import PrivacyIcon from "./components/PrivacyIcon";
import "./Post.css";

export interface PostProps {
  post: PostSchema;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);

  const reactions = (post.reactions ?? 0) + (isLiked ? 1 : 0);

  const onLikeClicked = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-author-info">
          <div className="post-author-avatar">
            <img src={post.author.avatar} />
          </div>
          <div className="post-author-details">
            <h3>{post.author.name}</h3>
            <div className="post-meta">
              <span>{post.date}</span>
              <span>•</span>
              <PrivacyIcon className="post-privacy-icon" />
            </div>
          </div>
        </div>
        <div className="post-header-buttons">
          <button className="post-header-button">
            <DetailsIcon className="post-header-button-icon" />
          </button>
          <button className="post-header-button">
            <CloseIcon className="post-header-button-icon" />
          </button>
        </div>
      </div>
      {post.caption && (
        <div
          className="post-caption"
          style={{
            marginBottom: !post.image && reactions > 0 ? "2px" : "12px",
          }}
        >
          {post.caption}
        </div>
      )}
      {post.image && (
        <div className="post-image">
          <img src={post.image} />
        </div>
      )}
      {post.video && <PostVideoContent video={post.video} />}
      <div className="post-footer">
        {reactions > 0 && (
          <div className="post-interactions">
            <div className="post-reaction">
              <ReactionIcon className="post-reaction-icon" />
              {reactions}
            </div>
          </div>
        )}
        <div className="post-footer-buttons">
          <button
            className={`post-footer-button ${isLiked ? "liked" : ""}`}
            onClick={onLikeClicked}
          >
            <img
              className={`post-footer-button-icon ${isLiked ? "liked" : ""}`}
              src={isLiked ? LikeSolidIcon : LikeIcon}
            />
            <span>Suka</span>
          </button>
          <button className="post-footer-button">
            <img className="post-footer-button-icon" src={CommentIcon} />
            <span>Komentar</span>
          </button>
          <button className="post-footer-button">
            <img className="post-footer-button-icon" src={SendIcon} />
            <span>Kirim</span>
          </button>
          <button className="post-footer-button">
            <img className="post-footer-button-icon" src={ShareIcon} />
            <span>Bagikan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
