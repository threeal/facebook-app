import React, { useState } from "react";
import type { PostSchema } from "shared";
import CommentIcon from "./assets/comment-icon.png";
import LikeIcon from "./assets/like-icon.png";
import LikeSolidIcon from "./assets/like-solid-icon.png";
import SendIcon from "./assets/send-icon.png";
import ShareIcon from "./assets/share-icon.png";
import CloseIcon from "./icons/CloseIcon";
import DetailsIcon from "./icons/DetailsIcon";
import ReactionIcon from "./icons/ReactionIcon";
import PrivacyIcon from "./icons/PrivacyIcon";
import PostMedia from "./PostMedia";
import "./Post.css";

export interface PostProps {
  post: PostSchema;
}

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();

  const dd = date.getUTCDate().toString();
  const mm = monthNames[date.getUTCMonth()];

  return date.getUTCFullYear() != now.getUTCFullYear()
    ? `${dd} ${mm} ${date.getUTCFullYear().toString()}`
    : `${dd} ${mm}`;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);

  const trimmedCaption = post.caption.trim();
  const reactions = post.reactions + (isLiked ? 1 : 0);

  const onLikeClicked = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-author-info">
          <div className="post-author-avatar">
            <img
              src={`/static/users/avatars/${post.author.id.toString()}/40x40.webp`}
            />
          </div>
          <div className="post-author-details">
            <h3>{post.author.name}</h3>
            <div className="post-meta">
              <span>{formatDate(post.timestamp)}</span>
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
      {trimmedCaption !== "" && (
        <div
          className="post-caption"
          style={{
            marginBottom: !post.mediaType && reactions > 0 ? "2px" : "12px",
          }}
        >
          {trimmedCaption}
        </div>
      )}
      {post.mediaType && (
        <PostMedia postId={post.id} mediaType={post.mediaType} />
      )}
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
