import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AdminLoginSchema } from "@/lib/validation";
import { cleanPhoneNumber } from "@/lib/utils";
import { verifyPassword, signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-client";
    const limiter = rateLimit(`admin_login_${ip}`, 10, 5 * 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, message: "Too many login attempts. Please wait 5 minutes." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = AdminLoginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: parseResult.error.errors[0]?.message || "Invalid credentials format" },
        { status: 400 }
      );
    }

    const cleanPhone = cleanPhoneNumber(parseResult.data.phone);
    const admin = await prisma.admin.findUnique({
      where: { phone: cleanPhone },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid administrator credentials" },
        { status: 401 }
      );
    }

    if (!admin.isSetupComplete || !admin.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          requiresSetup: true,
          message: "First-time password setup required for this administrator account.",
        },
        { status: 403 }
      );
    }

    const isPasswordValid = await verifyPassword(parseResult.data.password, admin.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid administrator credentials" },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    // Create session token
    const token = signAdminToken({
      id: admin.id,
      name: admin.name,
      phone: admin.phone,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        role: admin.role,
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication server error" },
      { status: 500 }
    );
  }
}
