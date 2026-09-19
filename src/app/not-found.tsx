import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-center px-6">
      <p className="kicker">404</p>
      <h1 className="display mt-4 text-5xl">This page is not in the system.</h1>
      <Link href="/" className="mt-8 text-accent hover:underline">
        Return home
      </Link>
    </main>
  );
}
