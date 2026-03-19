"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useCreatePost } from "@/hooks/use-posts";

export default function NewPostPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const createPost = useCreatePost();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const data = await createPost.mutateAsync({ title, content });
            router.push(`/dashboard/post/${data.post.id}`);
        } catch {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <main className="mx-auto max-w-2xl px-6 py-8">
            <button
                onClick={() => router.push("/dashboard")}
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="text-3xl font-bold text-white placeholder:text-neutral-500 focus-visible:ring-0 border-none border-b border-neutral-800 rounded-none px-4 h-auto py-3 bg-transparent"
                    />
                    <div className="border-t border-neutral-800" />
                    <Textarea
                        placeholder="Tell your story..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={16}
                        className="text-lg text-neutral-300 placeholder:text-neutral-500 focus-visible:ring-0 border-none rounded-none px-4 py-3 resize-none leading-relaxed bg-transparent"
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={createPost.isPending || !title}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/60 cursor-pointer disabled:opacity-50"
                    >
                        {createPost.isPending ? "Publishing..." : "Publish"}
                    </Button>
                </div>
            </form>
        </main>
    );
}
