const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌸 Initializing pristine Dandiya Night 2026 database (Zero Initial State)...");

  // 1. Purge all dummy students and payment requests
  const deletedRequests = await prisma.paymentRequest.deleteMany({});
  console.log(`🧹 Cleared ${deletedRequests.count} payment request(s).`);

  const deletedStudents = await prisma.student.deleteMany({});
  console.log(`🧹 Cleared ${deletedStudents.count} student record(s).`);

  await prisma.auditLog.deleteMany({});
  console.log("🧹 Cleared mock audit log entries.");

  // 2. Initialize / Verify Event Settings
  await prisma.eventSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      eventName: "Dandiya Night 2026",
      eventDate: "October 18, 2026 • 6:30 PM Onwards",
      eventVenue: "University Grand Amphitheater & Lawns",
      eventDescription:
        "Join us for an enchanted festive evening of traditional Raas-Garba, live Gujarati dhol beats, vibrant ethnic attire, food stalls, and timeless cultural harmony.",
      upiId: "dandiyanight2026@upi",
      adminWhatsApp: "918651879192",
      adminDisplayName: "Dandiya Organizing Committee",
      minAmount: 100,
      maxAmount: 10000,
    },
  });

  // 3. Initialize the Two Official Admins Only
  // Admin 1: Aaditya Gupta (86518 79192)
  // Admin 2: Akhil Tiwari (9142150166)
  const defaultHash1 = await bcrypt.hash("Admin@Dandiya2026!", 12);
  const defaultHash2 = await bcrypt.hash("Admin@Dandiya2026!", 12);

  await prisma.admin.upsert({
    where: { phone: "8651879192" },
    update: {},
    create: {
      name: "Aaditya Gupta",
      phone: "8651879192",
      email: "aaditya.gupta@event.edu",
      passwordHash: defaultHash1,
      isSetupComplete: true,
      role: "admin",
    },
  });

  await prisma.admin.upsert({
    where: { phone: "9142150166" },
    update: {},
    create: {
      name: "Akhil Tiwari",
      phone: "9142150166",
      email: "akhil.tiwari@event.edu",
      passwordHash: defaultHash2,
      isSetupComplete: true,
      role: "admin",
    },
  });

  console.log("✅ Database reset complete. Zero initial fund, zero contributors, empty student directory ready for official import!");
}

main()
  .catch((e) => {
    console.error("❌ Reset error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
