import { z } from "zod";

export const StudentSearchSchema = z.object({
  query: z.string().trim().min(2, "Search query must be at least 2 characters").max(50),
});

export const PaymentSubmitSchema = z.object({
  studentId: z.string().min(1, "Student identification required"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than zero")
    .min(10, "Minimum contribution is ₹10")
    .max(50000, "Maximum contribution per transaction is ₹50,000"),
  utr: z
    .string()
    .trim()
    .min(6, "UTR must be at least 6 characters")
    .max(30, "UTR is too long")
    .regex(/^[A-Za-z0-9_-]+$/, "UTR can only contain alphanumeric characters"),
  honeypot: z.string().optional(), // Spam defense: should always be empty
});

export const AdminLoginSchema = z.object({
  phone: z.string().trim().min(8, "Valid phone number required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const AdminSetupSchema = z.object({
  phone: z.string().trim().min(8, "Valid phone number required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const PaymentVerifySchema = z.object({
  requestId: z.string().min(1, "Request ID required"),
  action: z.enum(["APPROVE", "REJECT"]),
  rejectionReason: z.string().trim().max(200).optional(),
});

export const EventSettingsSchema = z.object({
  eventName: z.string().trim().min(3).max(100),
  eventDate: z.string().trim().min(3).max(100),
  eventVenue: z.string().trim().min(3).max(100),
  eventDescription: z.string().trim().min(10).max(500),
  upiId: z.string().trim().min(3).max(100),
  qrCodeUrl: z.string().nullable().optional(),
  adminWhatsApp: z.string().trim().min(8).max(20),
  adminDisplayName: z.string().trim().min(2).max(100),
  minAmount: z.number().min(1).max(10000),
  maxAmount: z.number().min(100).max(100000),
});
