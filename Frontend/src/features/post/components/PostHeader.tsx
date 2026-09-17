import { PostDetail } from "../types/post.types";
import { PostCover } from "./PostCover";
import { PostMeta } from "./PostMeta";

interface PostHeaderProps {
  post: PostDetail;
}

export const PostHeader = ({ post }: PostHeaderProps) => {
  return (
    <header className="mb-10">
      {/* Category Badge */}
      <div className="mb-6 flex justify-center lg:justify-start">
        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
          {post.category}
        </span>
      </div>

      {/* Title */}
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.1] text-center lg:text-left balance-text">
        {post.title}
      </h1>

      {/* Subtitle (Future Ready) */}
      {post.subtitle && (
        <p className="mb-8 text-xl text-muted-foreground text-center lg:text-left balance-text">
          {post.subtitle}
        </p>
      )}

      {/* Author & Meta Data */}
      <div className="mt-8 mb-10 flex justify-center lg:justify-start">
        <PostMeta post={post} />
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <PostCover src={post.coverImage} alt={post.title} />
      )}
    </header>
  );
};
