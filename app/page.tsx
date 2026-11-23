"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  date: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/posts", { cache: "no-store" })
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  const filteredPosts = posts.filter((post) =>
    `${post.title} ${post.content}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <main className="container mt-4">
      <h1>Blog Posts</h1>
      <Link href="/create" className="btn btn-primary mb-3">
        Create Post
      </Link>
      <input
        type="search"
        className="form-control mb-3"
        placeholder="Search posts"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {filteredPosts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul className="list-group">
          {filteredPosts.map((post) => (
            <li key={post.id} className="list-group-item">
              <Link href={`/posts/${post.id}`}>
                {post.title}
              </Link>
              <span className="text-muted float-end">{post.date}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

