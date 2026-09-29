import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { maskUTR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-client";
    const limiter = rateLimit(`status_${ip}`, 30, 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") || "").trim();

    if (!query || query.length < 2) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid registration number, roll number, or name." },
        { status: 400 }
      );
    }

    // Find student requests
    const requests = await prisma.paymentRequest.findMany({
      where: {
        OR: [
          { requestId: { equals: query } },
          { student: { registrationNo: { equals: query } } },
          { student: { rollNo: { equals: query } } },
          { student: { name: { contains: query } } },
        ],
      },
      include: {
        student: {
          select: {
            name: true,
            rollNo: true,
            registrationNo: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
      take: 10,
    });

    const safeResults = requests.map((req) => ({
      requestId: req.requestId,
      studentName: req.student.name,
      rollNo: req.student.rollNo,
      registrationNo: req.student.registrationNo,
      amount: req.amount,
      status: req.status,
      maskedUtr: maskUTR(req.utr),
      rejectionReason: req.status === "REJECTED" ? req.rejectionReason : null,
      submittedAt: req.submittedAt,
      verifiedAt: req.approvedAt || req.rejectedAt,
    }));

    return NextResponse.json({
      success: true,
      results: safeResults,
    });
  } catch (error) {
    console.error("Status search error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to retrieve payment status." },
      { status: 500 }
    );
  }
}
