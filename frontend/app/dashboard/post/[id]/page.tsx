"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import { usePost, useDeletePost } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const CommentSection = dynamic(
    () => import("@/components/app-ui/CommentSection"),
    {
        loading: () => (
            <div className="mt-12 pt-8 border-t border-neutral-800">
                <Skeleton className="h-5 w-32 mb-6" />
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        ),
    },
);

function PostDetailSkeleton() {
    return (
        <div>
            <div className="flex items-center gap-1 mb-8">
                <Skeleton className="h-4 w-14" />
            </div>
            <div className="flex items-center gap-3 mb-6">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-3 w-40" />
                </div>
            </div>
            <Skeleton className="h-10 w-3/4 mb-6" />
            <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-2/3" />
            </div>
        </div>
    );
}

export default function PostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;
    const user = useAuth();
    const { data: post, isLoading } = usePost(postId);
    const deletePost = useDeletePost(postId);

    const handleDelete = async () => {
        await deletePost.mutateAsync();
        router.push("/dashboard");
    };

    return (
        <main className="mx-auto max-w-2xl px-6 py-8">
            {isLoading || !post ? (
                <PostDetailSkeleton />
            ) : (
                <>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center gap-1 text-sm text-neutral-500 hover:text-emerald-400 transition-colors mb-8 cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>

                    <article>
                        <div className="flex items-center gap-3 mb-6">
                            <Link href={`/dashboard/profile/${post.author.username}`}>
                                <Image
                                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${post.author.username || "user"}`}
                                    alt="avatar"
                                    width={40}
                                    height={40}
                                    className="rounded-full bg-neutral-800 cursor-pointer hover:ring-2 hover:ring-emerald-500/50 transition-all"
                                />
                            </Link>
                            <div>
                                <Link href={`/dashboard/profile/${post.author.username}`} className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">
                                    {post.author.name || post.author.username}
                                </Link>
                                <p className="text-xs text-neutral-500">
                                    @{post.author.username} · {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {new Date(post.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                </p>
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
                            {post.title}
                        </h1>

                        <div className="prose prose-invert max-w-none">
                            <p className="text-neutral-300 text-lg leading-relaxed whitespace-pre-wrap">
                                {post.content || "No content."}
                            </p>
                        </div>

                        {post.authorId === user.id && (
                            <div className="flex gap-2 mt-12 pt-6 border-t border-neutral-800">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/dashboard/edit/${post.id}`)}
                                    className="gap-1.5 text-neutral-400 border-neutral-800 hover:text-emerald-400 hover:bg-neutral-900 hover:border-emerald-900/50 cursor-pointer"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={deletePost.isPending}
                                            className="gap-1.5 text-red-400 border-neutral-800 hover:text-red-300 hover:bg-red-950/30 hover:border-red-900/50 cursor-pointer"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            {deletePost.isPending ? "Deleting..." : "Delete"}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-neutral-900 border-neutral-800">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-neutral-400">
                                                This will permanently delete your post. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer">
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDelete}
                                                className="bg-red-600 hover:bg-red-500 text-white border-none cursor-pointer"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </article>

                    <CommentSection
                        postId={post.id}
                        postAuthorId={post.authorId}
                        currentUserId={user.id}
                    />
                </>
            )}
        </main>
    );
}
