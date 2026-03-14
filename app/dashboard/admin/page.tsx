import { KeyRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requirePermission } from "@/lib/auth/guards";

const analyticsCards = [
  { label: "Total users", value: "214", trend: "+8% this month" },
  { label: "Active clinics", value: "14", trend: "+2 locations" },
  { label: "Monthly recurring revenue", value: "$84,200", trend: "+12.3% MoM" },
  { label: "System uptime", value: "99.98%", trend: "No incidents in 21 days" }
];

const weeklyActiveUsers = [52, 58, 60, 74, 78, 85, 92];
const roleDistribution = [
  { role: "Clinicians", percent: 38 },
  { role: "Clinic Managers", percent: 24 },
  { role: "Front Desk", percent: 21 },
  { role: "Billing Staff", percent: 17 }
];

const users = [
  { name: "Olivia Brooks", email: "olivia@auroraclinic.com", role: "Admin", status: "Active", clinic: "Austin North" },
  { name: "Noah Kim", email: "noah@auroraclinic.com", role: "Manager", status: "Active", clinic: "Dallas Central" },
  { name: "Ethan Patel", email: "ethan@auroraclinic.com", role: "Billing", status: "Pending", clinic: "Houston Heights" },
  { name: "Mia Green", email: "mia@auroraclinic.com", role: "Clinician", status: "Active", clinic: "Austin South" }
];

const roles = [
  { name: "Super Admin", permissions: "All modules, billing controls, org settings", members: 3 },
  { name: "Clinic Admin", permissions: "Users, schedule, analytics, reports", members: 8 },
  { name: "Billing Lead", permissions: "Invoices, plans, payment failures", members: 11 },
  { name: "Support", permissions: "Read-only access, audit logs", members: 6 }
];

const clinics = [
  { name: "Austin North", address: "1204 W Medical Pkwy, Austin, TX", status: "Live", seats: 36 },
  { name: "Dallas Central", address: "2808 Cedar Ave, Dallas, TX", status: "Live", seats: 28 },
  { name: "Houston Heights", address: "950 Riverline St, Houston, TX", status: "Onboarding", seats: 20 }
];

const invoices = [
  { org: "Aurora Dermatology Group", plan: "Enterprise", amount: "$24,000", status: "Paid", renewal: "Apr 12, 2026" },
  { org: "Clearview Medical Partners", plan: "Growth", amount: "$11,400", status: "Due", renewal: "Mar 28, 2026" },
  { org: "Blue Horizon Clinics", plan: "Growth", amount: "$9,200", status: "Past due", renewal: "Mar 01, 2026" }
];

const activityLogs = [
  { event: "Role updated", detail: "Clinic Admin role gained Billing:Approve permission", actor: "Olivia Brooks", time: "2 min ago" },
  { event: "User invited", detail: "New manager invited to Dallas Central clinic", actor: "Noah Kim", time: "19 min ago" },
  { event: "Billing alert", detail: "Payment retry succeeded for Blue Horizon Clinics", actor: "System", time: "43 min ago" },
  { event: "Settings changed", detail: "MFA requirement enabled for all admins", actor: "Olivia Brooks", time: "1 hr ago" },
  { event: "Clinic added", detail: "Houston Heights workspace created", actor: "System", time: "3 hr ago" }
];

export default async function AdminDashboardPage() {
  await requirePermission("admin.manage");
  const maxWeeklyActiveUsers = Math.max(...weeklyActiveUsers);

  return (
    <main className="space-y-4 pb-8">
      <section className="rounded-2xl border bg-white/85 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Platform Administration</p>
        <h2 className="mt-1 text-2xl font-semibold">Healthcare SaaS Admin Dashboard</h2>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Central control for identity, authorization, clinic operations, analytics, billing visibility, and platform settings.
        </p>
      </section>

      <section className="space-y-4">
          <section id="analytics" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {analyticsCards.map((metric) => (
              <Card key={metric.label}>
                <CardHeader className="pb-2">
                  <CardDescription>{metric.label}</CardDescription>
                  <CardTitle className="text-2xl">{metric.value}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">{metric.trend}</CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Active Users</CardTitle>
                <CardDescription>Usage trend across clinics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last 7 days</span>
                  <span>Peak: {maxWeeklyActiveUsers}</span>
                </div>
                <div className="rounded-xl border bg-muted/20 p-4">
                  <div className="relative h-40">
                    <div className="absolute inset-0 grid grid-rows-4">
                      <div className="border-b border-dashed border-border/80" />
                      <div className="border-b border-dashed border-border/80" />
                      <div className="border-b border-dashed border-border/80" />
                      <div className="border-b border-dashed border-border/80" />
                    </div>
                    <div className="absolute inset-0 flex items-end gap-3">
                      {weeklyActiveUsers.map((value, idx) => (
                        <div key={`${value}-${idx}`} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                          <span className="text-[11px] font-semibold text-muted-foreground">{value}</span>
                          <div
                            className="w-full rounded-md bg-[hsl(var(--primary))]"
                            style={{ height: `${Math.max(Math.round((value / maxWeeklyActiveUsers) * 100), 12)}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3">
                    {weeklyActiveUsers.map((_, idx) => (
                      <span key={`label-${idx}`} className="flex-1 text-center text-[11px] text-muted-foreground">
                        D{idx + 1}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Role Distribution</CardTitle>
                <CardDescription>Permission footprint by team type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {roleDistribution.map((item) => (
                  <div key={item.role} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.role}</span>
                      <span className="font-medium">{item.percent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section id="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">Manage Users</CardTitle>
                  <CardDescription>Provision access and account lifecycle</CardDescription>
                </div>
                <Button size="sm">Invite user</Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="py-2 pr-3">Name</th>
                        <th className="py-2 pr-3">Email</th>
                        <th className="py-2 pr-3">Role</th>
                        <th className="py-2 pr-3">Clinic</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.email} className="border-b last:border-0">
                          <td className="py-3 pr-3 font-medium">{user.name}</td>
                          <td className="py-3 pr-3 text-muted-foreground">{user.email}</td>
                          <td className="py-3 pr-3">{user.role}</td>
                          <td className="py-3 pr-3">{user.clinic}</td>
                          <td className="py-3">
                            <span className="rounded-full border px-2 py-1 text-xs">{user.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="roles" className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Roles & Permissions</CardTitle>
                <CardDescription>Fine-grained access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {roles.map((role) => (
                  <article key={role.name} className="rounded-lg border bg-muted/20 p-3">
                    <p className="text-sm font-semibold">{role.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{role.permissions}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{role.members} members assigned</p>
                  </article>
                ))}
              </CardContent>
            </Card>

            <Card id="settings">
              <CardHeader>
                <CardTitle className="text-lg">System Settings</CardTitle>
                <CardDescription>Security, compliance, and operational defaults</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <article className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Require MFA for all admins</p>
                  <p className="text-xs text-muted-foreground">Enabled for every account with elevated privileges.</p>
                </article>
                <article className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Session timeout</p>
                  <p className="text-xs text-muted-foreground">15 minutes of inactivity for clinical and billing screens.</p>
                </article>
                <article className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Audit retention policy</p>
                  <p className="text-xs text-muted-foreground">Store user and billing events for 18 months.</p>
                </article>
                <Button variant="outline" className="w-full">
                  <KeyRound className="h-4 w-4" />
                  Open security settings
                </Button>
              </CardContent>
            </Card>
          </section>

          <section id="clinics" className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">Clinic Locations</CardTitle>
                  <CardDescription>Multi-site workspace management</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Add location
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {clinics.map((clinic) => (
                  <article key={clinic.name} className="rounded-lg border p-3">
                    <p className="text-sm font-semibold">{clinic.name}</p>
                    <p className="text-xs text-muted-foreground">{clinic.address}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Status: {clinic.status} • Seats: {clinic.seats}
                    </p>
                  </article>
                ))}
              </CardContent>
            </Card>

            <Card id="billing">
              <CardHeader>
                <CardTitle className="text-lg">Billing Overview</CardTitle>
                <CardDescription>Subscription health and invoice status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {invoices.map((invoice) => (
                  <article key={invoice.org} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{invoice.org}</p>
                      <span className="rounded-full border px-2 py-1 text-[11px] uppercase">{invoice.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {invoice.plan} • {invoice.amount} • Renewal {invoice.renewal}
                    </p>
                  </article>
                ))}
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Logs</CardTitle>
                <CardDescription>Recent administrative actions and system events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {activityLogs.map((log) => (
                  <article key={`${log.event}-${log.time}`} className="rounded-lg border bg-muted/20 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{log.event}</p>
                      <p className="text-xs text-muted-foreground">{log.time}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{log.detail}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">Actor: {log.actor}</p>
                  </article>
                ))}
              </CardContent>
            </Card>
          </section>
      </section>
    </main>
  );
}
