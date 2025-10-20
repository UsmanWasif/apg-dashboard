import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ GET — Paginated Customer List
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 5;

  const total = await prisma.customer.count();
  const customers = await prisma.customer.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { id: "desc" },
  });

  return NextResponse.json({ customers, total, pageSize });
}

// ✅ POST — Create a New Customer
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Destructure only valid fields that exist in your Prisma model
    const { customer_name, email, username, password } = body;

    // Validate minimal data before insert
    if (!customer_name || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields: customer_name, username, or password" },
        { status: 400 }
      );
    }

    // ✅ Create customer safely (no id or timestamps needed — Prisma handles those)
    const newCustomer = await prisma.customer.create({
      data: {
        customer_name,
        email: email || null,
        username,
        password,
      },
    });

    return NextResponse.json(newCustomer);
  } catch (error: any) {
    console.error("❌ Error creating customer:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
