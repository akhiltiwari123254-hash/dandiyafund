# Dandiya Night 2026 — Fund Management Platform

A production-ready, secure, responsive, and culturally elevated web platform for managing student voluntary contributions for **Dandiya Night 2026**, combining modern Indian festive aesthetics (*maroon, saffron, antique gold, warm ivory*) with a robust, enterprise-grade SaaS financial dashboard.

---

## 🌸 Key Capabilities & Architecture

- **Modern Indian Cultural Luxury Aesthetic**: High-contrast, WCAG-compliant festive palette inspired by traditional Navratri and Raas-Garba celebrations.
- **Signature Dandiya 2D/3D Canvas Intro Animation**: Lightweight, 2-4 second opening experience featuring two stylized traditionally dressed dancers, stick contact sparks, sacred geometry mandala bloom, skip/replay controls, and `prefers-reduced-motion` compliance.
- **Zero Payment Gateway Friction**: External UPI transfers via dynamic QR and UPI ID (`dandiyanight2026@upi`) with UTR transaction verification.
- **Strict Privacy Architecture**:
  - **No batch-wise contribution totals** (2023, 2024, 2025, 2026 are never compared).
  - **No public contributor lists, rankings, or leaderboards**.
  - **Masked UTR display** on public status checks (`••••••••9012`).
  - Total Fund is strictly computed as `SUM(amount WHERE status = 'APPROVED')`.
- **Dual Equal Admin Access**:
  - **Admin 1**: Aaditya Gupta (`+91 86518 79192`)
  - **Admin 2**: Akhil Tiwari (`+91 91421 50166`)
  - Both admins have identical access, independent secure password setup via `/admin/setup`, and full control over settings.
- **Excel & CSV 6-Step Importer**:
  - Step 1: File Upload (`.xlsx`, `.xls`, `.csv`).
  - Step 2: Auto-detects columns: Name, Roll Number, Registration Number, Batch.
  - Step 3: Interactive 15-row preview.
  - Step 4: Client & server-side validation (detects missing fields, duplicate roll/reg numbers).
  - Step 5: Summary metrics (Total, Valid, Duplicates, Invalid).
  - Step 6: Confirmation dialog with choice of import mode (*Skip duplicates*, *Update existing*, *Add new only*).
  - Sample template generator download.
- **Zero-Cost WhatsApp Notification**:
  - On payment submission, students can click "Notify Admin on WhatsApp", which launches a pre-formatted safe transaction receipt directly to the admin's WhatsApp number.
  - Actual approval/rejection occurs **only** inside the authenticated admin panel.
- **Configurable Event Settings**:
  - Event Name, Event Date, Venue, Description, UPI ID, QR Code, WhatsApp number, and Min/Max limits can all be modified from `/admin/settings` without code changes.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database ORM**: Prisma ORM (SQLite for zero-friction local execution, PostgreSQL/Supabase ready)
- **Authentication**: Salted bcrypt password hashing & HttpOnly signed JWT session cookies
- **Spreadsheet Processing**: `xlsx`
- **QR Generation**: `qrcode`
- **Icons**: `lucide-react`

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="dandiya-night-2026-super-secure-jwt-auth-key-981247"
ADMIN_BOOTSTRAP_TOKEN="dandiya2026-secure-bootstrap"
NODE_ENV="development"
```

### 3. Initialize & Seed Database
```bash
npx prisma db push
node prisma/seed.js
```
The seed script initializes:
- Default event settings
- Pre-registers the two official administrators
- Seeds initial student records across batches 2023, 2024, 2025, and 2026
- Seeds initial payment requests for realism

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Administrator Credentials & Setup

The application supports exactly two equal-level admin accounts:
1. **Aaditya Gupta** (`8651879192`)
2. **Akhil Tiwari** (`9142150166`)

### Initial Password Setup:
Navigate to:
```
http://localhost:3000/admin/setup
```
Select your account, enter your private password (min 8 characters), and submit. The credentials are encrypted using bcrypt (salt rounds = 12).

### Administrator Login:
```
http://localhost:3000/admin/login
```
Sign in with your phone number and password to access the verification center.

---

## 📁 Key Routes

- `/` — Public Cultural Home & Dashboard (Total Fund, Contributors, Opening Animation)
- `/contribute` — Student Contribution Flow (Search $\rightarrow$ Scan UPI QR $\rightarrow$ Submit UTR $\rightarrow$ WhatsApp Receipt)
- `/status` — Student Payment Tracking (Real-time status, masked UTR, rejection reasons)
- `/privacy` — Privacy Policy & Data Governance
- `/terms` — Terms & Conditions
- `/admin/login` — Administrator Authentication
- `/admin/setup` — Administrator First-Time Password Setup
- `/admin/dashboard` — Financial KPI Dashboard
- `/admin/requests` — Payment Verification (Approve / Reject with Reason)
- `/admin/students` — Student Directory & Manual Entry
- `/admin/import` — 6-Step Excel/CSV Batch Importer
- `/admin/settings` — Event & UPI Configuration
- `/admin/audit` — Immutable Administrative Audit Trail
