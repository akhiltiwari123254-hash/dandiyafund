# Deployment Guide — Dandiya Night 2026 Fund Portal

This guide provides step-by-step instructions to publish this platform to the internet using **Vercel** or **Netlify** and share it with your college students.

---

## ⚡ Option 1: Deploy on Vercel (Recommended — Free & 2 Minutes)

Vercel is the creator of Next.js and provides the smoothest, fastest hosting for this application.

### Step 1: Push Project to GitHub
1. Initialize a git repository in this project directory (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial Dandiya Night 2026 commit"
   ```
2. Create a new private or public repository on [GitHub](https://github.com) named `dandiya-night-fund`.
3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/dandiya-night-fund.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Set Up a Free Database
Since Vercel Serverless runs across dynamic instances, use a free cloud PostgreSQL database:
- **Option A (Supabase)**: Create a free project at [supabase.com](https://supabase.com). Copy the Transaction Connection String (`postgres://...`).
- **Option B (Neon)**: Create a free PostgreSQL database at [neon.tech](https://neon.tech). Copy the connection URI.
- **Option C (Vercel Postgres)**: In your Vercel Dashboard, click **Storage** → **Create Database (Postgres)**.

*(Note: In `prisma/schema.prisma`, simply ensure `provider = "postgresql"` is active when using PostgreSQL. A ready-to-use PostgreSQL schema is provided at `prisma/schema.postgresql.prisma`)*

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your `dandiya-night-fund` repository.
3. In **Environment Variables**, add:
   - `DATABASE_URL`: Your Supabase/Neon PostgreSQL connection string.
   - `JWT_SECRET`: A secure random 32-character string (e.g. `dandiya-super-secret-jwt-key-2026-prod`).
4. Click **Deploy**.
5. Once deployed, run the initial seed on your live database from your terminal:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```
   *(This initializes the default event settings and both official admin accounts with zero initial funds)*

Your website is now live at `https://your-project.vercel.app`!

---

## 🌐 Option 2: Deploy on Netlify

1. Go to [netlify.com](https://netlify.com) and select **"Add new site"** → **"Import an existing project"**.
2. Connect your GitHub repository.
3. Netlify will automatically detect Next.js using the included `netlify.toml`.
4. Add your Environment Variables under **Site configuration** → **Environment variables**:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `JWT_SECRET`: A secure random secret.
5. Click **Deploy Site**.

---

## 🔑 Administrator Access After Deployment

Once live:
1. Direct URL: `https://your-domain.com/admin/login`
2. **First-Time Password Setup**:
   Navigate to:
   ```
   https://your-domain.com/admin/setup
   ```
   - **Admin 1**: Aaditya Gupta (`8651879192`)
   - **Admin 2**: Akhil Tiwari (`9142150166`)
   Each admin can set their private secure password.

3. **Populate Student Directory**:
   Log into `/admin/import` and upload your official college Excel spreadsheet (`.xlsx` or `.csv`).

4. **Update Event Information**:
   Go to `/admin/settings` to customize the official UPI ID, QR code image, WhatsApp number, and event details.

---

## 📲 Sharing with Students

Once deployed:
1. Share the root URL `https://your-domain.com` with students via WhatsApp college groups, posters, and student portals.
2. Students can:
   - Verify their name and roll number at `/contribute`
   - Pay via the official UPI QR
   - Submit their UTR
   - Track approval status at `/status`
