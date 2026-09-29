import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { StudentSearchSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-client";
    const limiter = rateLimit(`search_${ip}`, 25, 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, message: "Too many search requests. Please slow down." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = StudentSearchSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: parseResult.error.errors[0]?.message || "Invalid query" },
        { status: 400 }
      );
    }

    const query = parseResult.data.query.trim();

    // 1. Check exact match for Registration Number or Roll Number
    const exactStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { registrationNo: { equals: query } },
          { rollNo: { equals: query } },
        ],
      },
      select: {
        id: true,
        name: true,
        rollNo: true,
        registrationNo: true,
        batch: true,
      },
    });

    if (exactStudent) {
      return NextResponse.json({
        success: true,
        students: [exactStudent],
      });
    }

    // 2. Partial search matching (limited to 5 results to avoid mass scraping)
    const matches = await prisma.student.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { rollNo: { contains: query } },
          { registrationNo: { contains: query } },
        ],
      },
      take: 5,
      select: {
        id: true,
        name: true,
        rollNo: true,
        registrationNo: true,
        batch: true,
      },
    });

    return NextResponse.json({
      success: true,
      students: matches,
    });
  } catch (error) {
    console.error("Student search error:", error);
    return NextResponse.json(
      { success: false, message: "Error searching student records" },
      { status: 500 }
    );
  }
}
