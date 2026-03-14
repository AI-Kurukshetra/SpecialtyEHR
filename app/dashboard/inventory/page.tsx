import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireDashboardUser } from "@/services/dashboard";

export default async function InventoryPage() {
  const { snapshot } = await requireDashboardUser();

  return (
    <main className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Inventory Management</CardTitle>
          <CardDescription>Supplies, medications, and equipment stock with reorder intelligence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshot.inventoryItems.map((item) => {
            const lowStock = item.quantityOnHand <= item.reorderPoint;
            return (
              <article key={item.id} className="rounded-lg border p-3">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="mt-1 text-xs text-muted-foreground capitalize">{item.category} • {item.locationName}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  On hand: {item.quantityOnHand} • Reorder point: {item.reorderPoint}
                </p>
                <p className="mt-1 text-xs font-medium text-primary">{lowStock ? "Reorder recommended" : "Stock healthy"}</p>
              </article>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Notifications</CardTitle>
          <CardDescription>Operational and clinical events across locations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshot.notifications.map((notification) => (
            <article key={notification.id} className="rounded-lg border p-3">
              <p className="text-sm font-semibold">{notification.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{notification.description}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{notification.type}</p>
            </article>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
