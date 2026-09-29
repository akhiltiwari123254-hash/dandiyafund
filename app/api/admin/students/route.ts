import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateStudentSchema = z.object({
  name: z.string().trim().min(2).max(100),
  rollNo: z.string().trim().min(2).max(50),
  registrationNo: z.string().trim().min(2).max(50),
  batch: z.string().trim().min(4).max(10),
});

export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim();
    const batch = searchParams.get("batch") || "ALL";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "25", 10)));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (batch !== "ALL") {
      where.batch = batch;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { rollNo: { contains: search } },
        { registrationNo: { contains: search } },
      ];
    }

    const [students, totalFiltered, totalStudents, batchCounts] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          _count: {
            select: { requests: true },
          },
        },
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
      prisma.student.count({ where }),
      prisma.student.count(),
      prisma.student.groupBy({
        by: ["batch"],
        _count: true,
      }),
    ]);

    return NextResponse.json({
      success: true,
      students,
      pagination: {
        page,
        limit,
        totalFiltered,
        totalPages: Math.ceil(totalFiltered / limit),
      },
      stats: {
        totalStudents,
        batchCounts,
      },
    });
  } catch (error) {
    console.error("Admin fetch students error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load students." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = CreateStudentSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: parseResult.error.errors[0]?.message || "Invalid student data" },
        { status: 400 }
      );
    }

    const { name, rollNo, registrationNo, batch } = parseResult.data;

    // Check duplicate registration
    const existing = await prisma.student.findUnique({
      where: { registrationNo },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Student with registration number ${registrationNo} already exists.` },
        { status: 409 }
      );
    }

    const student = await prisma.student.create({
      data: { name, rollNo, registrationNo, batch },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminName: admin.name,
        action: "STUDENT_ADDED",
        targetId: student.id,
        details: JSON.stringify({ name, rollNo, registrationNo, batch }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Student added successfully",
      student,
    });
  } catch (error) {
    console.error("Admin add student error:", error);
    return NextResponse.json(
      { success: false, message: "Error creating student record." },
      { status: 500 }
    );
  }
}
