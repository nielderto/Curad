"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

interface ProfileUser {
    id: string;
    name: string | null;
    username: string | null;
    createdAt: string;
}

interface ProfilePost {
    id: number;
    title: string;
    content: string | null;
    published: boolean;
    authorId: string;
    createdAt: string;
    author: { name: string | null; username: string | null };
}

interface ProfileComment {
    id: string;
    content: string;
    createdAt: string;
    authorId: string;
    author: { name: string | null; username: string | null };
    post: { id: number; title: string };
}

interface ProfileData {
    user: ProfileUser;
    posts: ProfilePost[];
    comments: ProfileComment[];
}

export function useProfile(username: string) {
    const query = useQuery({
        queryKey: ["profile", username],
        queryFn: () => apiFetch<ProfileData>(`/api/posts/user/${username}`),
        enabled: !!username,
    });

    return {
        user: query.data?.user ?? null,
        posts: query.data?.posts ?? [],
        comments: query.data?.comments ?? [],
        loading: query.isLoading,
    };
}
