import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { PaymentVerifySchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin authentication required." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = PaymentVerifySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: parseResult.error.errors[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { requestId, action, rejectionReason } = parseResult.data;

    // Fetch existing request
    const existing = await prisma.paymentRequest.findUnique({
      where: { requestId },
      include: { student: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: `Payment request ${requestId} not found.` },
        { status: 404 }
      );
    }

    // Critical Requirement: Prevent modifying an already finalized request
    if (existing.status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message: `Request ${requestId} has already been ${existing.status.toLowerCase()} by ${
            existing.verifiedBy || "another administrator"
          }. Finalized requests cannot be modified.`,
        },
        { status: 409 }
      );
    }

    let updated;
    const now = new Date();

    if (action === "APPROVE") {
      updated = await prisma.paymentRequest.update({
        where: { id: existing.id },
        data: {
          status: "APPROVED",
          approvedAt: now,
          verifiedBy: admin.name,
        },
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          adminId: admin.id,
          adminName: admin.name,
          action: "PAYMENT_APPROVED",
          targetId: existing.requestId,
          details: JSON.stringify({
            amount: existing.amount,
            utr: existing.utr,
            studentName: existing.student.name,
            rollNo: existing.student.rollNo,
          }),
        },
      });
    } else {
      const reason = (rejectionReason && rejectionReason.trim().length > 0)
        ? rejectionReason.trim()
        : "Payment reference verification failed";

      updated = await prisma.paymentRequest.update({
        where: { id: existing.id },
        data: {
          status: "REJECTED",
          rejectedAt: now,
          rejectionReason: reason,
          verifiedBy: admin.name,
        },
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          adminId: admin.id,
          adminName: admin.name,
          action: "PAYMENT_REJECTED",
          targetId: existing.requestId,
          details: JSON.stringify({
            amount: existing.amount,
            utr: existing.utr,
            studentName: existing.student.name,
            reason,
          }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Request ${requestId} successfully ${action.toLowerCase()}d.`,
      request: updated,
    });
  } catch (error) {
    console.error("Admin verify request error:", error);
    return NextResponse.json(
      { success: false, message: "Error updating payment request." },
      { status: 500 }
    );
  }
}
