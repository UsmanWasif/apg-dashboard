import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const updated = await prisma.customer.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.customer.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ message: "Customer deleted" });
}
