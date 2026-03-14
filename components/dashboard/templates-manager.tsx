"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";

type Template = {
  id: string;
  specialty: string;
  name: string;
  template_type: string;
  is_active: boolean;
};

export function TemplatesManager({ isAdmin }: { isAdmin: boolean }) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [specialty, setSpecialty] = useState("dermatology");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("SOAP");

  const filtered = useMemo(() => templates.filter((t) => t.specialty === specialty), [templates, specialty]);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/templates?specialty=${specialty}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load templates");
      setTemplates(json.data ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load templates");
    } finally {
      setLoading(false);
    }
  }, [specialty]);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

  async function createTemplate() {
    if (!name.trim()) {
      setMessage("Template name is required");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialty,
          name,
          template_type: type,
          content: {
            sections: [
              { key: "subjective", label: "Subjective" },
              { key: "objective", label: "Objective" },
              { key: "assessment", label: "Assessment" },
              { key: "plan", label: "Plan" }
            ]
          }
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Template creation failed");
      setName("");
      setMessage("Template created");
      await loadTemplates();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Template creation failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="dermatology">Dermatology</option>
          <option value="ophthalmology">Ophthalmology</option>
          <option value="plastic_surgery">Plastic Surgery</option>
        </select>
        {isAdmin && (
          <>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New template name" className="max-w-xs" />
            <select value={type} onChange={(e) => setType(e.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">
              <option value="SOAP">SOAP</option>
              <option value="procedure">Procedure</option>
              <option value="assessment">Assessment</option>
            </select>
            <Button onClick={createTemplate} disabled={saving}>
              <PlusCircle className="h-4 w-4" />
              {saving ? "Creating..." : "Create"}
            </Button>
          </>
        )}
      </div>

      {loading ? (
        <Loader label="Loading templates..." />
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-lg border p-3">
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.specialty} • {item.template_type} • {item.is_active ? "active" : "inactive"}
              </p>
            </article>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">No templates found.</p>}
        </div>
      )}

      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
