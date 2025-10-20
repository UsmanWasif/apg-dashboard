import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const customer = await prisma.customer.findFirst({
      where: { email },
    });

    if (!customer) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (customer.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // For now we don't use JWT — just simple confirmation
    return NextResponse.json({
      message: "Login successful",
      token: `customer-${customer.id}`,
      customer: {
        id: customer.id,
        email: customer.email,
        username: customer.username,
        company_name: customer.company_name,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
