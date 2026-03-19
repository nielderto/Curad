"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PostCard from "@/components/app-ui/PostCard";
import { useProfile } from "@/hooks/use-profile";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileSkeleton() {
    return (
        <div>
            <div className="flex items-center gap-1 mb-8">
                <Skeleton className="h-4 w-14" />
            </div>
            <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div>
                    <Skeleton className="h-7 w-40 mb-2" />
                    <Skeleton className="h-4 w-52 mb-1" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
            <Skeleton className="h-10 w-full mb-6" />
            <div className="space-y-0">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border-b border-neutral-800 py-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const [activeTab, setActiveTab] = useState("posts");
    const { user: profileUser, posts, comments, loading } = useProfile(
        params.username as string
    );

    if (loading) {
        return (
            <main className="mx-auto max-w-2xl px-6 py-8">
                <ProfileSkeleton />
            </main>
        );
    }

    if (!profileUser) {
        return (
            <main className="mx-auto max-w-2xl px-6 py-8">
                <p className="text-neutral-400 text-center py-16">User not found</p>
            </main>
        );
    }

    const memberSince = new Date(profileUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <main className="mx-auto max-w-2xl px-6 py-8">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1 text-sm text-neutral-500 hover:text-emerald-400 transition-colors mb-8 cursor-pointer"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </button>

            <div className="flex items-center gap-4 mb-8">
                <Image
                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${profileUser.username || "user"}`}
                    alt="avatar"
                    width={64}
                    height={64}
                    className="rounded-full bg-neutral-800"
                />
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {profileUser.name || profileUser.username}
                    </h1>
                    <p className="text-sm text-neutral-500">
                        @{profileUser.username} · Joined {memberSince}
                    </p>
                    <div className="flex gap-4 mt-1">
                        <span className="text-xs text-neutral-400">{posts.length} posts</span>
                        <span className="text-xs text-neutral-400">{comments.length} comments</span>
                    </div>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList variant="line" className="w-full border-b border-neutral-800 mb-6">
                    <TabsTrigger value="posts" className="text-neutral-400 data-[state=active]:text-emerald-400 after:bg-emerald-400 cursor-pointer">
                        Posts
                    </TabsTrigger>
                    <TabsTrigger value="comments" className="text-neutral-400 data-[state=active]:text-emerald-400 after:bg-emerald-400 cursor-pointer">
                        Comments
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    {activeTab === "posts" && (
                        posts.length === 0 ? (
                            <p className="text-neutral-600 text-sm text-center py-8">No posts yet.</p>
                        ) : (
                            <div>
                                {posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        id={post.id}
                                        title={post.title}
                                        content={post.content}
                                        author={post.author}
                                        createdAt={post.createdAt}
                                    />
                                ))}
                            </div>
                        )
                    )}

                    {activeTab === "comments" && (
                        comments.length === 0 ? (
                            <p className="text-neutral-600 text-sm text-center py-8">No comments yet.</p>
                        ) : (
                            <div className="flex flex-col">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="border-b border-neutral-800 py-4">
                                        <Link
                                            href={`/dashboard/post/${comment.post.id}`}
                                            className="text-xs text-neutral-500 hover:text-emerald-400 transition-colors mb-2 block"
                                        >
                                            on &quot;{comment.post.title}&quot;
                                        </Link>
                                        <p className="text-neutral-300 text-sm line-clamp-1">{comment.content}</p>
                                        <span className="text-xs text-neutral-600 mt-2 block">
                                            {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {new Date(comment.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </motion.div>
            </AnimatePresence>
        </main>
    );
}
