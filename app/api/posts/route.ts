import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const posts = await prisma.post.findMany({
        orderBy: {
            id: "desc",
        },
    });
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
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

    const date = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date());

    const newPost = await prisma.post.create({
        data: {
            title,
            content,
            date,
        },
    });
    return NextResponse.json(newPost, { status: 201 });
}
