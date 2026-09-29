import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface ImportRecord {
  name: string;
  rollNo: string;
  registrationNo: string;
  batch: string;
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
    const records: ImportRecord[] = body.records || [];
    const mode: "add_new" | "update_existing" | "skip_duplicates" = body.mode || "skip_duplicates";

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { success: false, message: "No records provided for import." },
        { status: 400 }
      );
    }

    let added = 0;
    let updated = 0;
    let skipped = 0;

    // Process records in batches
    for (const record of records) {
      const name = String(record.name || "").trim();
      const rollNo = String(record.rollNo || "").trim();
      const registrationNo = String(record.registrationNo || "").trim();
      const batch = String(record.batch || "").trim();

      if (!name || !rollNo || !registrationNo || !batch) {
        skipped++;
        continue;
      }

      const existing = await prisma.student.findUnique({
        where: { registrationNo },
      });

      if (existing) {
        if (mode === "update_existing") {
          await prisma.student.update({
            where: { id: existing.id },
            data: { name, rollNo, batch },
          });
          updated++;
        } else {
          skipped++;
        }
      } else {
        await prisma.student.create({
          data: { name, rollNo, registrationNo, batch },
        });
        added++;
      }
    }

    // Write audit log
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminName: admin.name,
        action: "STUDENT_IMPORTED",
        details: JSON.stringify({
          totalProcessed: records.length,
          added,
          updated,
          skipped,
          mode,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Batch import complete: ${added} added, ${updated} updated, ${skipped} skipped.`,
      summary: {
        total: records.length,
        added,
        updated,
        skipped,
      },
    });
  } catch (error) {
    console.error("Batch import error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to complete batch import." },
      { status: 500 }
    );
  }
}
