"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    if (!token) router.push("/customer/login");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("customer_token");
    router.push("/customer/login");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e8f1ff] via-[#dbe8ff] to-[#c2d8ff] flex flex-col">
      {/* Golden Nav Bar */}
      <header className="flex items-center justify-between bg-white/90 backdrop-blur-md px-8 py-4 shadow-md border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">
          Customer Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-apgGold hover:bg-apgGoldHover text-white px-5 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </header>

      {/* Welcome Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="bg-white/90 border border-gray-200 shadow-lg rounded-3xl px-10 py-12 w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome to Your Customer Portal 👋
          </h2>
          <p className="text-gray-600">
            This is your dashboard. Future updates will include account info,
            recent activity, and order tracking.
          </p>
        </div>
      </section>

      <footer className="text-center py-4 text-gray-500 text-sm border-t border-gray-200 bg-white/70 backdrop-blur-md">
        © {new Date().getFullYear()} APG Packaging. All rights reserved.
      </footer>
    </main>
  );
}
