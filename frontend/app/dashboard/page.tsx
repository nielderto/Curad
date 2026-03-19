"use client";

import { Suspense, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/app-ui/PostCard";
import { usePosts } from "@/hooks/use-posts";
import { Skeleton } from "@/components/ui/skeleton";

function PostSkeleton() {
    return (
        <div className="border-b border-neutral-800 py-6">
            <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3 mt-1" />
                </div>
            </div>
        </div>
    );
}

function FeedSkeleton() {
    return (
        <main className="mx-auto max-w-2xl px-6 py-8">
            {Array.from({ length: 5 }).map((_, i) => (
                <PostSkeleton key={i} />
            ))}
        </main>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<FeedSkeleton />}>
            <DashboardContent />
        </Suspense>
    );
}

function DashboardContent() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") || undefined;
    const {
        data,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = usePosts(searchQuery);

    const sentinelRef = useRef<HTMLDivElement>(null);

    const handleIntersect = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage],
    );

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(handleIntersect, {
            rootMargin: "200px",
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [handleIntersect]);

    const posts = data?.pages.flatMap((page) => page.posts) ?? [];

    return (
        <main className="mx-auto max-w-2xl px-6 py-8">
            {isLoading ? (
                <div>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <PostSkeleton key={i} />
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-neutral-400 text-lg mb-2">
                        {searchQuery ? "No posts found" : "No posts yet"}
                    </p>
                    <p className="text-neutral-600 text-sm">
                        {searchQuery
                            ? `No results for "${searchQuery}".`
                            : 'Click "Write" to create your first post.'}
                    </p>
                </div>
            ) : (
                <div>
                    {searchQuery && (
                        <p className="text-neutral-500 text-sm mb-4">
                            Results for &quot;{searchQuery}&quot;
                        </p>
                    )}
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

                    <div ref={sentinelRef} className="h-1" />

                    {isFetchingNextPage && (
                        <div>
                            {Array.from({ length: 2 }).map((_, i) => (
                                <PostSkeleton key={`loading-${i}`} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
