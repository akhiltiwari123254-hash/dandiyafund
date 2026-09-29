import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AdminSetupSchema } from "@/lib/validation";
import { cleanPhoneNumber } from "@/lib/utils";
import { hashPassword, signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { INITIAL_ADMINS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = AdminSetupSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: parseResult.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { phone, password } = parseResult.data;
    const cleanPhone = cleanPhoneNumber(phone);

    // Verify phone is one of the two authorized initial admins
    const authorizedAdmin = INITIAL_ADMINS.find((a) => a.phone === cleanPhone);
    if (!authorizedAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized administrator phone number." },
        { status: 403 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Upsert admin record
    const updatedAdmin = await prisma.admin.upsert({
      where: { phone: cleanPhone },
      update: {
        passwordHash: hashedPassword,
        isSetupComplete: true,
        lastLoginAt: new Date(),
      },
      create: {
        name: authorizedAdmin.name,
        phone: cleanPhone,
        passwordHash: hashedPassword,
        isSetupComplete: true,
        role: "admin",
        lastLoginAt: new Date(),
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        adminId: updatedAdmin.id,
        adminName: updatedAdmin.name,
        action: "ADMIN_PASSWORD_SETUP",
        details: JSON.stringify({ message: "Initial password setup completed securely." }),
      },
    });

    const token = signAdminToken({
      id: updatedAdmin.id,
      name: updatedAdmin.name,
      phone: updatedAdmin.phone,
      role: updatedAdmin.role,
    });

    const response = NextResponse.json({
      success: true,
      message: `Welcome, ${updatedAdmin.name}! Your administrator account has been securely configured.`,
      admin: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        phone: updatedAdmin.phone,
        role: updatedAdmin.role,
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Admin setup error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to configure administrator account." },
      { status: 500 }
    );
  }
}
