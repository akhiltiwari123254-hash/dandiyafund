import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const students = await prisma.student.findMany({
      orderBy: [{ batch: "asc" }, { rollNo: "asc" }],
    });

    let csvContent = "Name,Roll Number,Registration Number,Batch,Added At\n";
    students.forEach((s) => {
      const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
      csvContent += `${escape(s.name)},${escape(s.rollNo)},${escape(s.registrationNo)},${escape(
        s.batch
      )},${s.createdAt.toISOString()}\n`;
    });

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="dandiya_students_${new Date()
          .toISOString()
          .split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate CSV export." },
      { status: 500 }
    );
  }
}
