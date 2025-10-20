"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  email: string;
  exp: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        setAdmin(decoded);
      }
    } catch {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        {admin ? (
          <>
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">
              Welcome, {admin.email}
            </h1>
            <p className="text-gray-600 mb-6">Admin ID: {admin.id}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </main>
  );
}
