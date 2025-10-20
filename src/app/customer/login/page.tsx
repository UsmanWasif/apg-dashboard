"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    const res = await fetch("/api/customers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("customer_token", data.token);
      router.push("/customer/dashboard");
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8f1ff] via-[#dbe8ff] to-[#c2d8ff]">
      <div className="bg-white/90 shadow-xl rounded-3xl p-8 w-full max-w-md border border-gray-200 backdrop-blur-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Customer Login
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to access your customer portal
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-apgGold outline-none text-gray-800"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-apgGold outline-none text-gray-800"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-apgGold hover:bg-apgGoldHover text-white font-medium py-3 rounded-lg shadow-sm transition-all"
          >
            Login
          </button>
        </div>

        <div className="mt-6 text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} APG Packaging. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
