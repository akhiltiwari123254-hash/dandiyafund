import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Calculate strictly from APPROVED payment requests
    const [fundAggregate, uniqueStudents, settings] = await Promise.all([
      prisma.paymentRequest.aggregate({
        _sum: { amount: true },
        where: { status: "APPROVED" },
      }),
      prisma.paymentRequest.groupBy({
        by: ["studentId"],
        where: { status: "APPROVED" },
      }),
      prisma.eventSettings.findUnique({
        where: { id: "default" },
      }),
    ]);

    const totalFund = fundAggregate._sum.amount || 0;
    const totalContributors = uniqueStudents.length;

    return NextResponse.json({
      success: true,
      stats: {
        totalFund,
        totalContributors,
      },
      settings: settings
        ? {
            eventName: settings.eventName,
            eventDate: settings.eventDate,
            eventVenue: settings.eventVenue,
            eventDescription: settings.eventDescription,
            upiId: settings.upiId,
            qrCodeUrl: settings.qrCodeUrl,
            adminWhatsApp: settings.adminWhatsApp,
            adminDisplayName: settings.adminDisplayName,
            minAmount: settings.minAmount,
            maxAmount: settings.maxAmount,
          }
        : null,
    });
  } catch (error) {
    console.error("Failed to fetch public stats:", error);
    return NextResponse.json(
      { success: false, message: "Unable to load event statistics" },
      { status: 500 }
    );
  }
}
