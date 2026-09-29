import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin authentication required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status") || "ALL";
    const search = (searchParams.get("search") || "").trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (statusFilter !== "ALL" && ["PENDING", "APPROVED", "REJECTED"].includes(statusFilter)) {
      whereClause.status = statusFilter;
    }

    if (search) {
      whereClause.OR = [
        { requestId: { contains: search } },
        { utr: { contains: search } },
        { student: { name: { contains: search } } },
        { student: { rollNo: { contains: search } } },
        { student: { registrationNo: { contains: search } } },
      ];
    }

    const [requests, totalFiltered, counts, fundAggregate] = await Promise.all([
      prisma.paymentRequest.findMany({
        where: whereClause,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              rollNo: true,
              registrationNo: true,
              batch: true,
            },
          },
        },
        orderBy: { submittedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.paymentRequest.count({ where: whereClause }),
      prisma.paymentRequest.groupBy({
        by: ["status"],
        _count: true,
      }),
      prisma.paymentRequest.aggregate({
        _sum: { amount: true },
        where: { status: "APPROVED" },
      }),
    ]);

    const countMap: Record<string, number> = { PENDING: 0, APPROVED: 0, REJECTED: 0 };
    counts.forEach((c) => {
      countMap[c.status] = c._count;
    });

    const totalAll = countMap.PENDING + countMap.APPROVED + countMap.REJECTED;

    return NextResponse.json({
      success: true,
      requests,
      pagination: {
        page,
        limit,
        totalFiltered,
        totalPages: Math.ceil(totalFiltered / limit),
      },
      summary: {
        totalAll,
        pendingCount: countMap.PENDING,
        approvedCount: countMap.APPROVED,
        rejectedCount: countMap.REJECTED,
        totalApprovedFund: fundAggregate._sum.amount || 0,
      },
    });
  } catch (error) {
    console.error("Admin fetch requests error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load payment requests." },
      { status: 500 }
    );
  }
}
