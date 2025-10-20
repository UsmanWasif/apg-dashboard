"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      router.push("/login");
      return;
    }

    // You can also decode token later; for now we just show a dummy email
    setAdmin({ email: "usman@gmail.com" });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!admin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8f1ff] via-[#dbe8ff] to-[#c2d8ff]">
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e8f1ff] via-[#dbe8ff] to-[#c2d8ff] flex flex-col">
      <header className="flex items-center justify-between bg-white/90 backdrop-blur-md px-8 py-4 shadow-md border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">APG Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-[#d2a655] hover:bg-[#b78d47] text-white px-5 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="bg-white/90 border border-gray-200 shadow-lg rounded-3xl px-10 py-12 w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome, Admin 👋
          </h2>
          <p className="text-gray-600">
            You are logged in as{" "}
            <span className="font-medium text-gray-800">{admin.email}</span>
          </p>
          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="bg-[#d2a655] hover:bg-[#b78d47] text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      <footer className="text-center py-4 text-gray-500 text-sm border-t border-gray-200 bg-white/70 backdrop-blur-md">
        © {new Date().getFullYear()} APG Packaging. All rights reserved.
      </footer>
    </main>
  );
}
