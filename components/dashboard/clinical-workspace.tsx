"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";

type ClinicalNote = {
  id: string;
  patient_id: string;
  assessment: string | null;
  status: string;
  created_at: string;
};

type Procedure = {
  id: string;
  patient_id: string;
  procedure_name: string;
  status: string;
  created_at: string;
};

export function ClinicalWorkspace() {
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [patientId, setPatientId] = useState("40000000-0000-0000-0000-000000000001");
  const [assessment, setAssessment] = useState("Stable follow-up assessment");
  const [procedureName, setProcedureName] = useState("Follow-up lesion review");
  const [medications, setMedications] = useState("Warfarin, Fluconazole");
  const [interactionResult, setInteractionResult] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [notesRes, procRes] = await Promise.all([fetch("/api/clinical-notes"), fetch("/api/procedures")]);
      const notesJson = await notesRes.json();
      const procJson = await procRes.json();
      if (!notesRes.ok) throw new Error(notesJson.error || "Failed to load notes");
      if (!procRes.ok) throw new Error(procJson.error || "Failed to load procedures");
      setNotes(notesJson.data ?? []);
      setProcedures(procJson.data ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load clinical data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function createNote() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/clinical-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          note_type: "SOAP",
          subjective: "Patient reports mild symptoms",
          objective: "No acute distress",
          assessment,
          plan: "Continue same treatment",
          status: "draft"
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create note");
      setMessage("Clinical note created");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create note");
    } finally {
      setSaving(false);
    }
  }

  async function createProcedure() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/procedures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          procedure_name: procedureName
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create procedure");
      setMessage("Procedure created");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create procedure");
    } finally {
      setSaving(false);
    }
  }

  async function checkInteractions() {
    setSaving(true);
    setMessage(null);
    setInteractionResult(null);
    try {
      const list = medications
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);
      const res = await fetch("/api/prescriptions/check-interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medications: list })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Interaction check failed");
      const interactions = json.data?.interactions ?? [];
      setInteractionResult(interactions.length ? JSON.stringify(interactions) : "No known high-risk interaction in demo rules.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Interaction check failed");
    } finally {
      setSaving(false);
    }
  }

  async function createPrescription() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          provider_id: "30000000-0000-0000-0000-000000000001",
          medication_name: "Clobetasol 0.05%",
          dosage: "Apply thin layer",
          frequency: "BID",
          interaction_checked: true
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Prescription create failed");
      setMessage("Prescription created");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Prescription create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="space-y-3 rounded-lg border p-3">
        <p className="text-sm font-semibold">Create note/procedure</p>
        <Input value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Patient ID" />
        <Input value={assessment} onChange={(e) => setAssessment(e.target.value)} placeholder="Assessment" />
        <div className="flex gap-2">
          <Button onClick={createNote} disabled={saving}>
            {saving ? "Saving..." : "Create note"}
          </Button>
          <Input value={procedureName} onChange={(e) => setProcedureName(e.target.value)} placeholder="Procedure name" />
          <Button onClick={createProcedure} disabled={saving} variant="outline">
            {saving ? "Saving..." : "Create procedure"}
          </Button>
        </div>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}
        <div className="border-t pt-3">
          <p className="mb-2 text-sm font-semibold">Prescription + interaction check</p>
          <Input value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="Medication list comma separated" />
          <div className="mt-2 flex gap-2">
            <Button onClick={checkInteractions} disabled={saving} variant="outline">
              {saving ? "Checking..." : "Check interactions"}
            </Button>
            <Button onClick={createPrescription} disabled={saving}>
              {saving ? "Saving..." : "Create prescription"}
            </Button>
          </div>
          {interactionResult && <p className="mt-2 text-xs text-muted-foreground">{interactionResult}</p>}
        </div>
      </div>

      {loading ? (
        <Loader label="Loading clinical data..." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Recent notes</p>
            {notes.slice(0, 5).map((n) => (
              <article key={n.id} className="rounded-lg border p-2 text-xs">
                <p className="font-medium">{n.patient_id}</p>
                <p className="text-muted-foreground">{n.assessment || "No assessment"}</p>
                <p className="text-muted-foreground">
                  {n.status} • {new Date(n.created_at).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Recent procedures</p>
            {procedures.slice(0, 5).map((p) => (
              <article key={p.id} className="rounded-lg border p-2 text-xs">
                <p className="font-medium">{p.procedure_name}</p>
                <p className="text-muted-foreground">{p.patient_id}</p>
                <p className="text-muted-foreground">
                  {p.status} • {new Date(p.created_at).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
