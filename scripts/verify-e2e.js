const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function runTests() {
  console.log("==========================================");
  console.log("🔍 RUNNING DANDIYA NIGHT 2026 AUDIT SUITE");
  console.log("==========================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Verify Admins Setup
  const admins = await prisma.admin.findMany();
  assert(admins.length === 2, `Exactly two admins registered (Found: ${admins.length})`);
  const aaditya = admins.find((a) => a.phone === "8651879192");
  const akhil = admins.find((a) => a.phone === "9142150166");
  assert(!!aaditya && aaditya.name === "Aaditya Gupta", "Admin 1 Aaditya Gupta verified");
  assert(!!akhil && akhil.name === "Akhil Tiwari", "Admin 2 Akhil Tiwari verified");
  assert(aaditya.role === akhil.role, "Both admins have identical role and permissions");

  // 2. Verify Initial Clean State: Zero Fund, Zero Requests, Zero Pre-populated Students
  const initialFundAgg = await prisma.paymentRequest.aggregate({
    _sum: { amount: true },
    where: { status: "APPROVED" },
  });
  const initialFund = initialFundAgg._sum.amount || 0;
  assert(initialFund === 0, `Initial Total Fund is strictly ₹0 (Found: ₹${initialFund})`);

  const initialRequests = await prisma.paymentRequest.count();
  assert(initialRequests === 0, `Initial payment requests count is 0 (Found: ${initialRequests})`);

  // 3. Test Workflow with Temporary Test Student
  const testStudent = await prisma.student.create({
    data: {
      name: "Temporary Verification Student",
      rollNo: "99TEST001",
      registrationNo: "999900001",
      batch: "2026",
    },
  });
  assert(!!testStudent, "Can create a verified student record");

  const testUtr = "TESTUTR20269999";
  const req1 = await prisma.paymentRequest.create({
    data: {
      requestId: "DN-99001",
      studentId: testStudent.id,
      amount: 500,
      utr: testUtr,
      status: "PENDING",
    },
  });
  assert(req1.status === "PENDING", "Payment request created with initial status PENDING");

  // 4. Test Duplicate UTR Protection
  let duplicateCaught = false;
  try {
    await prisma.paymentRequest.create({
      data: {
        requestId: "DN-99002",
        studentId: testStudent.id,
        amount: 500,
        utr: testUtr,
        status: "PENDING",
      },
    });
  } catch (err) {
    duplicateCaught = true;
  }
  assert(duplicateCaught, "Unique constraint strictly prevents duplicate UTR submission");

  // 5. Test Approval Workflow
  await prisma.paymentRequest.update({
    where: { id: req1.id },
    data: {
      status: "APPROVED",
      approvedAt: new Date(),
      verifiedBy: "Aaditya Gupta",
    },
  });

  const postApprovalFund = (
    await prisma.paymentRequest.aggregate({
      _sum: { amount: true },
      where: { status: "APPROVED" },
    })
  )._sum.amount || 0;

  assert(postApprovalFund === 500, "Total Fund increases strictly to approved amount");

  // 6. Test Rejection Workflow
  const testUtrReject = "TESTUTRREJECT01";
  const req2 = await prisma.paymentRequest.create({
    data: {
      requestId: "DN-99003",
      studentId: testStudent.id,
      amount: 1000,
      utr: testUtrReject,
      status: "PENDING",
    },
  });

  await prisma.paymentRequest.update({
    where: { id: req2.id },
    data: {
      status: "REJECTED",
      rejectedAt: new Date(),
      rejectionReason: "UTR not found in college bank ledger",
      verifiedBy: "Akhil Tiwari",
    },
  });

  const postRejectFund = (
    await prisma.paymentRequest.aggregate({
      _sum: { amount: true },
      where: { status: "APPROVED" },
    })
  )._sum.amount || 0;

  assert(
    postRejectFund === 500,
    "Rejected payment is strictly excluded from Total Fund"
  );

  // 7. Verify Event Settings Configurable
  const settings = await prisma.eventSettings.findUnique({ where: { id: "default" } });
  assert(!!settings, "Event Settings singleton exists");
  assert(settings.eventName === "Dandiya Night 2026", "Default event name verified");

  // Clean up all test data so database remains 100% clean
  await prisma.paymentRequest.deleteMany({
    where: { requestId: { in: ["DN-99001", "DN-99002", "DN-99003"] } },
  });
  await prisma.student.deleteMany({
    where: { id: testStudent.id },
  });

  // Verify final database state is pristine zero
  const finalStudentsCount = await prisma.student.count();
  const finalRequestsCount = await prisma.paymentRequest.count();
  const finalFund = (
    await prisma.paymentRequest.aggregate({
      _sum: { amount: true },
      where: { status: "APPROVED" },
    })
  )._sum.amount || 0;

  assert(finalStudentsCount === 0, `Database has 0 students ready for import (Found: ${finalStudentsCount})`);
  assert(finalRequestsCount === 0, `Database has 0 payment requests (Found: ${finalRequestsCount})`);
  assert(finalFund === 0, `Total Fund is strictly ₹0 (Found: ₹${finalFund})`);

  console.log("==========================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
