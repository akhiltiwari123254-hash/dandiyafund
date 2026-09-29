export const INITIAL_ADMINS = [
  {
    name: "Aaditya Gupta",
    phone: "8651879192", // sanitized digits for 86518 79192
    displayPhone: "+91 86518 79192",
  },
  {
    name: "Akhil Tiwari",
    phone: "9142150166", // sanitized digits for 9142150166
    displayPhone: "+91 91421 50166",
  },
];

export const VALID_BATCHES = ["2023", "2024", "2025", "2026"] as const;

export const DEFAULT_EVENT_SETTINGS = {
  eventName: "Dandiya Night 2026",
  eventDate: "October 18, 2026 • 6:30 PM Onwards",
  eventVenue: "University Grand Amphitheater & Lawns",
  eventDescription:
    "An auspicious evening of traditional Raas, vibrant Garba, live Gujarati dhol beats, delicious food stalls, and timeless festive celebration.",
  upiId: "dandiyanight2026@upi",
  adminWhatsApp: "918651879192",
  adminDisplayName: "Dandiya Organizing Committee",
  minAmount: 100,
  maxAmount: 10000,
};
