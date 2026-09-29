import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentSubmitSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { generateRequestId, maskUTR, normalizeUTR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-client";
    const limiter = rateLimit(`submit_${ip}`, 8, 5 * 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, message: "Too many submission attempts. Please wait a few minutes." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));

    // Honeypot check for bots
    if (body.honeypot) {
      return NextResponse.json(
        { success: false, message: "Spam detected." },
        { status: 400 }
      );
    }

    const parseResult = PaymentSubmitSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: parseResult.error.errors[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { studentId, amount, utr } = parseResult.data;
    const cleanUtr = normalizeUTR(utr);

    // 1. Verify Event Settings for Min/Max limits
    const settings = await prisma.eventSettings.findUnique({ where: { id: "default" } });
    const minAmount = settings?.minAmount ?? 10;
    const maxAmount = settings?.maxAmount ?? 50000;

    if (amount < minAmount) {
      return NextResponse.json(
        { success: false, message: `Minimum contribution allowed is ₹${minAmount}` },
        { status: 400 }
      );
    }

    if (amount > maxAmount) {
      return NextResponse.json(
        { success: false, message: `Maximum contribution allowed per submission is ₹${maxAmount}` },
        { status: 400 }
      );
    }

    // 2. Prevent duplicate UTR submissions
    const existingUtr = await prisma.paymentRequest.findUnique({
      where: { utr: cleanUtr },
    });

    if (existingUtr) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This UTR / Transaction Reference has already been submitted in our system. Duplicate submissions are not allowed. Please check your payment status.",
        },
        { status: 409 }
      );
    }

    // 3. Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student record not found in the approved student database." },
        { status: 404 }
      );
    }

    // 4. Generate unique Request ID (e.g. DN-10492)
    let uniqueRequestId = generateRequestId();
    let collisionCheck = await prisma.paymentRequest.findUnique({
      where: { requestId: uniqueRequestId },
    });
    while (collisionCheck) {
      uniqueRequestId = generateRequestId();
      collisionCheck = await prisma.paymentRequest.findUnique({
        where: { requestId: uniqueRequestId },
      });
    }

    // 5. Create Payment Request
    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        requestId: uniqueRequestId,
        studentId: student.id,
        amount,
        utr: cleanUtr,
        status: "PENDING",
      },
    });

    const masked = maskUTR(cleanUtr);
    const adminWhatsApp = settings?.adminWhatsApp || "918651879192";

    // Format safe WhatsApp prefilled message
    const waText = encodeURIComponent(
      `New Dandiya Night payment request\nRequest ID: ${uniqueRequestId}\nStudent: ${student.name}\nAmount: ₹${amount}\nUTR: ${masked}\nPlease verify in Admin Panel.`
    );
    const whatsAppUrl = `https://wa.me/${adminWhatsApp.replace(/[^0-9]/g, "")}?text=${waText}`;

    return NextResponse.json({
      success: true,
      data: {
        requestId: paymentRequest.requestId,
        studentName: student.name,
        rollNo: student.rollNo,
        registrationNo: student.registrationNo,
        amount: paymentRequest.amount,
        maskedUtr: masked,
        status: "PENDING",
        whatsAppUrl,
        adminWhatsApp,
      },
    });
  } catch (error) {
    console.error("Payment submit error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred while processing your payment request." },
      { status: 500 }
    );
  }
}
