import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("🧩 Incoming Login Request:", { email, password });

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      console.log("❌ Admin not found");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.log("🧠 Found Admin:", admin);

    // Simple plain text comparison (no bcrypt)
    if (admin.password !== password) {
      console.log("❌ Invalid password");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.log("✅ Login successful");

    // You can later replace this with JWT/session
    return NextResponse.json({
      message: "Login successful",
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error("🔥 Login Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
