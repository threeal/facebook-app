export interface PostData {
  author: {
    name: string;
    avatar: string;
  };
  caption?: string;
  image?: string;
  video?: string;
  reactions?: number;
  date: string;
}
