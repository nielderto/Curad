"use client";

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, apiPost, apiPut, apiDelete } from "@/lib/api";

export interface Post {
    id: number;
    title: string;
    content: string | null;
    published: boolean;
    authorId: string;
    author: { name: string | null; username: string | null };
    createdAt: string;
}

interface PostsPage {
    message: string;
    posts: Post[];
    nextCursor: number | null;
}

export function usePosts(searchQuery?: string) {
    return useInfiniteQuery({
        queryKey: ["posts", searchQuery ?? ""],
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams();
            if (searchQuery) params.set("search", searchQuery);
            if (pageParam) params.set("cursor", String(pageParam));
            const qs = params.toString();
            return apiFetch<PostsPage>(`/api/posts${qs ? `?${qs}` : ""}`);
        },
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });
}

export function usePost(id: string) {
    return useQuery({
        queryKey: ["post", id],
        queryFn: () => apiFetch<{ post: Post }>(`/api/posts/${id}`).then((d) => d.post),
        enabled: !!id,
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: { title: string; content: string }) =>
            apiPost<{ post: Post }>("/api/posts", body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
}

export function useUpdatePost(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: { title: string; content: string }) =>
            apiPut<{ post: Post }>(`/api/posts/${id}`, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", id] });
        },
    });
}

export function useDeletePost(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => apiDelete(`/api/posts/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.removeQueries({ queryKey: ["post", id] });
        },
    });
}
