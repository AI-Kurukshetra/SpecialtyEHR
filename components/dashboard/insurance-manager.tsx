"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";

type Insurance = {
  id: string;
  payer_name: string;
  member_id: string;
  verification_status: string;
};

export function InsuranceManager({ patientId }: { patientId: string }) {
  const [insurances, setInsurances] = useState<Insurance[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [payerName, setPayerName] = useState("Blue Cross");
  const [memberId, setMemberId] = useState("NEW-MEMBER-001");

  async function loadInsurances() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/patients/${patientId}/insurances`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load insurances");
      setInsurances(json.data ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load insurances");
    } finally {
      setLoading(false);
    }
  }

  async function addInsurance() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/patients/${patientId}/insurances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payer_name: payerName,
          member_id: memberId
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to add insurance");
      setMessage("Insurance added");
      await loadInsurances();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to add insurance");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border p-3">
      <div className="flex flex-wrap gap-2">
        <Button onClick={loadInsurances} variant="outline" disabled={loading}>
          {loading ? "Loading..." : "Refresh insurance"}
        </Button>
        <Input value={payerName} onChange={(e) => setPayerName(e.target.value)} placeholder="Payer name" className="max-w-[170px]" />
        <Input value={memberId} onChange={(e) => setMemberId(e.target.value)} placeholder="Member ID" className="max-w-[180px]" />
        <Button onClick={addInsurance} disabled={saving}>
          {saving ? "Saving..." : "Add insurance"}
        </Button>
      </div>

      {loading && <Loader label="Loading insurance records..." />}

      {insurances && (
        <div className="space-y-2">
          {insurances.map((ins) => (
            <article key={ins.id} className="rounded-md border p-2 text-xs">
              <p className="font-medium">{ins.payer_name}</p>
              <p className="text-muted-foreground">
                {ins.member_id} • {ins.verification_status}
              </p>
            </article>
          ))}
          {insurances.length === 0 && <p className="text-xs text-muted-foreground">No insurance records.</p>}
        </div>
      )}

      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
