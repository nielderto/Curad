"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, MessageCircle, Reply } from "lucide-react";
import { useComments, type Comment } from "@/hooks/use-comments";
import Link from "next/link";
import Image from "next/image";
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

interface CommentSectionProps {
    postId: number;
    postAuthorId: string;
    currentUserId: string;
}

const CommentItem = memo(function CommentItem({
    comment,
    currentUserId,
    postAuthorId,
    onDelete,
    onReply,
    replyingTo,
    replyContent,
    setReplyContent,
    submittingReply,
    onSubmitReply,
    onCancelReply,
    depth = 0,
}: {
    comment: Comment;
    currentUserId: string;
    postAuthorId: string;
    onDelete: (id: string) => void;
    onReply: (id: string) => void;
    replyingTo: string | null;
    replyContent: string;
    setReplyContent: (v: string) => void;
    submittingReply: boolean;
    onSubmitReply: (parentId: string) => void;
    onCancelReply: () => void;
    depth?: number;
}) {
    const isPostAuthor = comment.authorId === postAuthorId;
    const canReply = currentUserId !== comment.authorId && currentUserId === postAuthorId;
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
        <div>
            <div className="flex gap-3 py-4">
                <div className="flex flex-col items-center">
                    <Link href={`/dashboard/profile/${comment.author.username}`} className="shrink-0">
                        <Image
                            src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${comment.author.username || "user"}`}
                            alt="avatar"
                            width={32}
                            height={32}
                            className="rounded-full bg-neutral-800 cursor-pointer hover:ring-2 hover:ring-emerald-500/50 transition-all"
                        />
                    </Link>
                    {hasReplies && (
                        <div className="w-px flex-1 bg-neutral-700/50 hover:bg-emerald-500/40 transition-colors mt-2 rounded-full" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/dashboard/profile/${comment.author.username}`}
                                className="text-sm font-medium text-white hover:text-emerald-400 transition-colors"
                            >
                                {comment.author.name || comment.author.username}
                            </Link>
                            {isPostAuthor && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-800/50">
                                    Author
                                </span>
                            )}
                            <span className="text-xs text-neutral-600">·</span>
                            <span className="text-xs text-neutral-500">
                                {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {new Date(comment.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {canReply && (
                                <button
                                    onClick={() => onReply(comment.id)}
                                    className="text-neutral-600 hover:text-emerald-400 transition-colors cursor-pointer"
                                >
                                    <Reply className="h-3.5 w-3.5" />
                                </button>
                            )}

                            {comment.authorId === currentUserId && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="text-neutral-600 hover:text-red-400 transition-colors cursor-pointer">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-neutral-900 border-neutral-800">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-white">Delete comment?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-neutral-400">
                                                This will permanently delete your comment.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer">
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => onDelete(comment.id)}
                                                className="bg-red-600 hover:bg-red-500 text-white border-none cursor-pointer"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    </div>
                    <p className="text-neutral-300 text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>

                    {replyingTo === comment.id && (
                        <div className="mt-3">
                            <Textarea
                                placeholder={`Reply to ${comment.author.name || comment.author.username}...`}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                rows={2}
                                className="bg-neutral-900 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20 resize-none mb-2 text-sm"
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={onCancelReply}
                                    className="text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    disabled={submittingReply || !replyContent.trim()}
                                    onClick={() => onSubmitReply(comment.id)}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/60 cursor-pointer disabled:opacity-50 text-xs"
                                >
                                    {submittingReply ? "Replying..." : "Reply"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {hasReplies && (
                <div className="ml-4 border-l-2 border-neutral-700/40 hover:border-emerald-500/30 transition-colors pl-4">
                    {comment.replies!.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            currentUserId={currentUserId}
                            postAuthorId={postAuthorId}
                            onDelete={onDelete}
                            onReply={onReply}
                            replyingTo={replyingTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            submittingReply={submittingReply}
                            onSubmitReply={onSubmitReply}
                            onCancelReply={onCancelReply}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export default function CommentSection({ postId, postAuthorId, currentUserId }: CommentSectionProps) {
    const { comments, loading, addComment, deleteComment } = useComments(postId);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [submittingReply, setSubmittingReply] = useState(false);

    const isPostAuthor = currentUserId === postAuthorId;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setSubmitting(true);

        const success = await addComment(newComment.trim());
        if (success) setNewComment("");
        setSubmitting(false);
    };

    const handleReply = async (parentId: string) => {
        if (!replyContent.trim()) return;
        setSubmittingReply(true);

        const success = await addComment(replyContent.trim(), parentId);
        if (success) {
            setReplyContent("");
            setReplyingTo(null);
        }
        setSubmittingReply(false);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyContent("");
    };

    const topLevelComments = comments.filter((c) => !c.parentId);
    const repliesByParent = comments.reduce<Record<string, Comment[]>>((acc, c) => {
        if (c.parentId) {
            if (!acc[c.parentId]) acc[c.parentId] = [];
            acc[c.parentId].push(c);
        }
        return acc;
    }, {});

    const commentsWithReplies = topLevelComments.map((c) => ({
        ...c,
        replies: repliesByParent[c.id] || [],
    }));

    return (
        <div className="mt-12 pt-8 border-t border-neutral-800">
            <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="h-5 w-5 text-neutral-400" />
                <h2 className="text-lg font-semibold text-white">
                    Comments {!loading && `(${comments.length})`}
                </h2>
            </div>

            {loading ? (
                <p className="text-neutral-500 text-sm text-center py-4">Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="text-neutral-600 text-sm text-center py-4">
                    {isPostAuthor ? "No comments yet." : "No comments yet. Be the first to comment."}
                </p>
            ) : (
                <div className="flex flex-col gap-1">
                    {commentsWithReplies.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserId={currentUserId}
                            postAuthorId={postAuthorId}
                            onDelete={deleteComment}
                            onReply={(id) => {
                                setReplyingTo(id);
                                setReplyContent("");
                            }}
                            replyingTo={replyingTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            submittingReply={submittingReply}
                            onSubmitReply={handleReply}
                            onCancelReply={handleCancelReply}
                        />
                    ))}
                </div>
            )}

            {!isPostAuthor && (
                <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-neutral-800">
                    <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        className="bg-neutral-900 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20 resize-none mb-3"
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            size="sm"
                            disabled={submitting || !newComment.trim()}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/60 cursor-pointer disabled:opacity-50"
                        >
                            {submitting ? "Posting..." : "Comment"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
