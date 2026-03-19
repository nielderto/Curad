import Router from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";
import type { Request, Response } from "express";
import { getCache, setCache, clearCache } from "../lib/cache";

export const CommentsRoute = Router();

CommentsRoute.get("/post/:postId", requireAuth, async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const comments = await prisma.comment.findMany({
            where: { postId: Number(postId) },
            include: { author: { select: { name: true, username: true } } },
            orderBy: { createdAt: "desc" },
        });

        res.status(200).json({ 
            message: comments.length > 0 ? "Comments fetched successfully" : "No comments found",
            comments });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

CommentsRoute.post("/post/:postId", requireAuth, async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        if (!content) {
            res.status(400).json({ error: "Content is required" });
            return;
        }

        const post = await prisma.post.findUnique({
            where: { id: Number(postId) },
        });

        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                authorId: res.locals.session.user.id,
                postId: Number(postId),
            },
            include: { author: { select: { name: true, username: true } } },
        });

        clearCache();

        res.status(201).json({ message: "Comment created successfully", comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

CommentsRoute.delete("/:id", requireAuth, async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const comment = await prisma.comment.findUnique({
            where: { id },
        });

        if (!comment || comment.authorId !== res.locals.session.user.id) {
            res.status(404).json({ error: "Comment not found" });
            return;
        }

        await prisma.comment.delete({
            where: { id },
        });

        clearCache();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
