"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { usePost, useUpdatePost } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import Redirect from "@/components/app-ui/Redirect";

function EditSkeleton() {
    return (
        <div>
            <div className="flex items-center gap-1 mb-8">
                <Skeleton className="h-4 w-14" />
            </div>
            <div className="border border-neutral-700 rounded-md overflow-hidden">
                <Skeleton className="h-12 w-full" />
                <div className="border-t border-neutral-800" />
                <Skeleton className="h-80 w-full" />
            </div>
        </div>
    );
}

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;
    const user = useAuth();
    const { data: post, isLoading: postLoading } = usePost(postId);
    const updatePost = useUpdatePost(postId);
    const [title, setTitle] = useState<string | null>(null);
    const [content, setContent] = useState<string | null>(null);
    const [error, setError] = useState("");

    if (post && post.authorId !== user.id) {
        return <Redirect to="/dashboard" />;
    }

    const currentTitle = title ?? post?.title ?? "";
    const currentContent = content ?? post?.content ?? "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await updatePost.mutateAsync({ title: currentTitle, content: currentContent });
            router.push(`/dashboard/post/${postId}`);
        } catch {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <main className="mx-auto max-w-2xl px-6 py-8">
            {postLoading || !post ? (
                <EditSkeleton />
            ) : (
                <>
                    <button
                        onClick={() => router.push(`/dashboard/post/${postId}`)}
                        className="flex items-center gap-1 text-sm text-neutral-500 hover:text-emerald-400 transition-colors mb-8 cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {error && (
                            <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-900/30 rounded-md p-2">
                                {error}
                            </div>
                        )}

                        <div className="border border-neutral-700 rounded-md bg-transparent overflow-hidden">
                            <Input
                                type="text"
                                placeholder="Title"
                                value={currentTitle}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="text-3xl font-bold text-white placeholder:text-neutral-500 focus-visible:ring-0 border-none border-b border-neutral-800 rounded-none px-4 h-auto py-3 bg-transparent"
                            />
                            <div className="border-t border-neutral-800" />
                            <Textarea
                                placeholder="Tell your story..."
                                value={currentContent}
                                onChange={(e) => setContent(e.target.value)}
                                rows={16}
                                className="text-lg text-neutral-300 placeholder:text-neutral-500 focus-visible:ring-0 border-none rounded-none px-4 py-3 resize-none leading-relaxed bg-transparent"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push(`/dashboard/post/${postId}`)}
                                className="text-neutral-400 border-neutral-700 hover:text-white hover:bg-neutral-900 cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={updatePost.isPending || !currentTitle}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/60 cursor-pointer disabled:opacity-50"
                            >
                                {updatePost.isPending ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </form>
                </>
            )}
        </main>
    );
}
