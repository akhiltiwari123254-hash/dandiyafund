import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { EventSettingsSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.eventSettings.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to load event settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = EventSettingsSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: parseResult.error.errors[0]?.message || "Invalid configuration" },
        { status: 400 }
      );
    }

    const updated = await prisma.eventSettings.upsert({
      where: { id: "default" },
      update: parseResult.data,
      create: {
        id: "default",
        ...parseResult.data,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminName: admin.name,
        action: "SETTINGS_UPDATED",
        details: JSON.stringify({
          eventName: updated.eventName,
          upiId: updated.upiId,
          adminWhatsApp: updated.adminWhatsApp,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Event settings updated successfully",
      settings: updated,
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update event settings." },
      { status: 500 }
    );
  }
}
