"use client";

import { trpc } from "@/utils/trpc";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Agile SaaSKit</h1>
      <Link
        href="/todos"
        className="mt-8 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Go to Todos
      </Link>
    </main>
  );
}
