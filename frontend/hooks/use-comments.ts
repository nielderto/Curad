"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, apiPost, apiDelete } from "@/lib/api";

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    authorId: string;
    postId: number;
    parentId: string | null;
    author: { name: string | null; username: string | null };
    replies?: Comment[];
}

export function useComments(postId: string | number) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["comments", String(postId)],
        queryFn: () =>
            apiFetch<{ comments: Comment[] }>(`/api/comments/post/${postId}`).then(
                (d) => d.comments,
            ),
        enabled: !!postId,
    });

    const addMutation = useMutation({
        mutationFn: (vars: { content: string; parentId?: string }) =>
            apiPost(`/api/comments/post/${postId}`, vars),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", String(postId)] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (commentId: string) => apiDelete(`/api/comments/${commentId}`),
        onMutate: async (commentId) => {
            await queryClient.cancelQueries({ queryKey: ["comments", String(postId)] });
            const previous = queryClient.getQueryData<Comment[]>(["comments", String(postId)]);
            queryClient.setQueryData<Comment[]>(
                ["comments", String(postId)],
                (old) => old?.filter((c) => c.id !== commentId) ?? [],
            );
            return { previous };
        },
        onError: (_err, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(["comments", String(postId)], context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", String(postId)] });
        },
    });

    const addComment = async (content: string, parentId?: string) => {
        try {
            await addMutation.mutateAsync({ content, parentId });
            return true;
        } catch {
            return false;
        }
    };

    const deleteComment = async (commentId: string) => {
        try {
            await deleteMutation.mutateAsync(commentId);
            return true;
        } catch {
            return false;
        }
    };

    return {
        comments: query.data ?? [],
        loading: query.isLoading,
        addComment,
        deleteComment,
    };
}
