"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Post = {
  id: number;
  title: string;
  content: string;
  date: string;
};

function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((data: Post) => {
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(() => router.replace("/"));
  }, [id, router]);

  const handleDelete = async () => {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    router.push("/");
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (!response.ok) return;
    const updated = await response.json();
    setPost(updated);
    setEditing(false);
  };

  if (!post) return <p className="container mt-4">Loading...</p>;

  return (
    <main className="container mt-4">
      {editing ? (
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Content</label>
            <textarea
              className="form-control"
              rows={5}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
            />
          </div>
          <button className="btn btn-success me-2" type="submit">
            Save
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h1>{post.title}</h1>
          <p className="text-muted">{post.date}</p>
          <p>{post.content}</p>
          <button
            onClick={() => setEditing(true)}
            className="btn btn-primary me-2"
          >
            Edit
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </>
      )}
    </main>
  );
}

export default function PostPage() {
  return (
    <Suspense fallback={<p className="container mt-4">Loading...</p>}>
      <PostDetail />
    </Suspense>
  );
}
