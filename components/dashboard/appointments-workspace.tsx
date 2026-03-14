"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";

type Appointment = {
  id: string;
  patient_id: string;
  provider_id: string;
  starts_at: string;
  ends_at: string;
  appointment_type: string;
  status: string;
};

export function AppointmentsWorkspace() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [patientId, setPatientId] = useState("40000000-0000-0000-0000-000000000001");
  const [providerId, setProviderId] = useState("30000000-0000-0000-0000-000000000001");
  const [startAt, setStartAt] = useState("2026-03-21T10:00:00Z");
  const [endAt, setEndAt] = useState("2026-03-21T10:20:00Z");

  async function loadAppointments() {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load appointments");
      setAppointments(json.data ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAppointments();
  }, []);

  async function createAppointment() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          provider_id: providerId,
          starts_at: startAt,
          ends_at: endAt,
          appointment_type: "follow_up"
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Booking failed");
      setMessage("Appointment booked");
      await loadAppointments();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
        <Input value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Patient ID" />
        <Input value={providerId} onChange={(e) => setProviderId(e.target.value)} placeholder="Provider ID" />
        <Input value={startAt} onChange={(e) => setStartAt(e.target.value)} placeholder="Starts at" />
        <Input value={endAt} onChange={(e) => setEndAt(e.target.value)} placeholder="Ends at" />
        <Button onClick={createAppointment} disabled={saving}>
          {saving ? "Booking..." : "Book appointment"}
        </Button>
      </div>

      {loading ? (
        <Loader label="Loading appointments..." />
      ) : (
        <div className="space-y-2">
          {appointments.map((a) => (
            <article key={a.id} className="rounded-lg border p-3">
              <p className="text-sm font-semibold">{a.appointment_type}</p>
              <p className="text-xs text-muted-foreground">
                {a.patient_id} • {a.provider_id}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(a.starts_at).toLocaleString()} - {new Date(a.ends_at).toLocaleString()} • {a.status}
              </p>
            </article>
          ))}
        </div>
      )}
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
