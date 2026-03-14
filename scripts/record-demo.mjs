import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.DEMO_BASE_URL ?? "http://127.0.0.1:3000";
const email = process.env.DEMO_EMAIL;
const password = process.env.DEMO_PASSWORD;

if (!email || !password) {
  console.error("Missing DEMO_EMAIL or DEMO_PASSWORD environment variables.");
  console.error("Example: DEMO_EMAIL=admin1.demo@aurorahealth.app DEMO_PASSWORD=Pass@123 npm run demo:video");
  process.exit(1);
}

const now = new Date().toISOString().replace(/[:.]/g, "-");
const outputDir = path.resolve("demos/videos", now);
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1728, height: 972 },
  recordVideo: {
    dir: outputDir,
    size: { width: 1728, height: 972 }
  }
});

const page = await context.newPage();

async function caption(text) {
  await page.evaluate((value) => {
    const id = "__demo_caption";
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const tag = document.createElement("div");
    tag.id = id;
    tag.innerText = value;
    tag.setAttribute(
      "style",
      [
        "position: fixed",
        "left: 24px",
        "top: 24px",
        "z-index: 999999",
        "padding: 10px 14px",
        "border-radius: 999px",
        "border: 1px solid rgba(255,255,255,.25)",
        "background: rgba(16,24,40,.78)",
        "backdrop-filter: blur(6px)",
        "color: #ffffff",
        "font: 600 14px/1.2 -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        "letter-spacing: .01em"
      ].join(";")
    );

    document.body.appendChild(tag);
  }, text);
}

async function pause(ms = 1400) {
  await page.waitForTimeout(ms);
}

async function goto(pathname, title, wait = 1700) {
  await page.goto(`${baseUrl}${pathname}`, { waitUntil: "networkidle" });
  await caption(title);
  await pause(wait);
}

console.log("[demo] Opening login page...");
await goto("/login", "NexTech EHR Demo | Login", 1400);

console.log("[demo] Signing in...");
await page.getByLabel("Work email").fill(email);
await page.getByLabel("Password").fill(password);
await page.getByRole("button", { name: /sign in/i }).click();
await page.waitForURL(/\/dashboard(\/.*)?/i, { timeout: 20000 });
await caption("Role-aware dashboard experience");
await pause(2200);

const flows = [
  ["/dashboard", "Overview | analytics cards and activity logs", 2200],
  ["/dashboard/patients", "Patients | registration and demographics", 1800],
  ["/dashboard/patients/new", "Patients | create patient form", 1800],
  ["/dashboard/appointments", "Appointments | schedule and management", 1900],
  ["/dashboard/clinical", "Clinical | SOAP notes and procedures", 1900],
  ["/dashboard/templates", "Templates | specialty-specific note templates", 1900],
  ["/dashboard/imaging", "Medical Imaging | DICOM/photo upload and viewer", 2200],
  ["/dashboard/billing", "Billing | invoices and claims overview", 1900],
  ["/dashboard/reports", "Reports | operational and clinical analytics", 1900],
  ["/dashboard/integrations", "Integrations | external system connectors", 1900],
  ["/dashboard/admin", "Admin | users, roles, permissions, and settings", 2100],
  ["/dashboard/profile", "Profile | account details", 1700],
  ["/dashboard/profile/edit", "Profile | edit profile form", 1900]
];

for (const [pathname, title, wait] of flows) {
  console.log(`[demo] ${pathname}`);
  await goto(pathname, title, Number(wait));
}

console.log("[demo] Opening profile menu and sign-out option...");
await page.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
await page.locator("summary").first().click();
await caption("Profile menu | profile view, edit, and sign out");
await pause(2000);

await caption("Demo complete");
await pause(1200);

const video = page.video();
await page.close();
await context.close();
await browser.close();

const videoPath = await video.path();
const finalPath = path.resolve(outputDir, "nextech-ehr-demo.webm");
fs.copyFileSync(videoPath, finalPath);

console.log("\n[demo] Video created successfully");
console.log(`[demo] File: ${finalPath}`);
console.log("[demo] Optional MP4 conversion (requires ffmpeg):");
console.log(`ffmpeg -i "${finalPath}" -c:v libx264 -pix_fmt yuv420p "${finalPath.replace(/\.webm$/, ".mp4")}"`);
