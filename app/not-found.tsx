import Link from "next/link";

export default function NotFound() {
    return (
        <main className="container mt-5">
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link href="/" className="btn btn-primary">
                Back to Home
            </Link>
        </main>
    );
}