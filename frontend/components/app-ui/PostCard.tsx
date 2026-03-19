import { memo } from "react";
import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
    id: number;
    title: string;
    content: string | null;
    author: { name: string | null; username: string | null };
    createdAt: string;
}

const PostCard = memo(function PostCard({ id, title, content, author, createdAt }: PostCardProps) {
    const date = new Date(createdAt);
    const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const formattedTime = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const preview = content
        ? content.length > 160 ? content.slice(0, 160) + "..." : content
        : "No content";

    return (
        <article className="group border-b border-neutral-800 py-6">
            <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            href={`/dashboard/profile/${author.username}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${author.username || "user"}`}
                                alt="avatar"
                                width={20}
                                height={20}
                                className="rounded-full bg-neutral-800 hover:ring-2 hover:ring-emerald-500/50 transition-all"
                            />
                        </Link>
                        <Link
                            href={`/dashboard/profile/${author.username}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors"
                        >
                            {author.name || author.username}
                        </Link>
                        <span className="text-xs text-neutral-600">·</span>
                        <span className="text-xs text-neutral-500">{formattedTime}</span>
                    </div>

                    <Link href={`/dashboard/post/${id}`} className="cursor-pointer">
                        <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight mb-1">
                            {title}
                        </h2>

                        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2">
                            {preview}
                        </p>
                    </Link>
                </div>
            </div>
        </article>
    );
});

export default PostCard;
