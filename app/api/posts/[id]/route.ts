import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

async function parseId(params: RouteParams["params"]) {
    const { id } = await params;
    const postId = Number(id);
    return Number.isInteger(postId) && postId > 0 ? postId : null;
}

export async function GET(_: Request, { params }: RouteParams) {
    const postId = await parseId(params);
    if (postId === null) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    });

    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(post);
}

export async function DELETE(_: Request, { params }: RouteParams) {
    const postId = await parseId(params);
    if (postId === null) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { count } = await prisma.post.deleteMany({ where: { id: postId } });
    if (count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" });
}

export async function PUT(request: Request, { params }: RouteParams) {
    const postId = await parseId(params);
    if (postId === null) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    if (typeof body !== "object" || body === null) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { title, content } = body as { title?: unknown; content?: unknown };
    if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof content !== "string" ||
        !content.trim()
    ) {
        return NextResponse.json(
            { error: "Title and content are required" },
            { status: 400 },
        );
    }

    const { count } = await prisma.post.updateMany({
        where: { id: postId },
        data: { title, content },
    });
    if (count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(
        await prisma.post.findUnique({ where: { id: postId } }),
    );
}
