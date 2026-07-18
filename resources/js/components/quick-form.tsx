import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FieldDef =
  | { name: string; label: string; type: "text" | "email" | "number" | "date"; required?: boolean; defaultValue?: string | number }
  | { name: string; label: string; type: "textarea"; required?: boolean; defaultValue?: string }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[]; required?: boolean; defaultValue?: string };

export function QuickForm({
  fields,
  onSubmit,
  onCancel,
  submitLabel = "Create",
  children,
}: {
  fields: FieldDef[];
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
  submitLabel?: string;
  children?: ReactNode;
}) {
  const initial: Record<string, string> = {};
  fields.forEach((f) => {
    initial[f.name] = f.defaultValue !== undefined ? String(f.defaultValue) : "";
  });
  const [values, setValues] = useState(initial);
  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div
            key={f.name}
            className={f.type === "textarea" ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}
          >
            <Label htmlFor={f.name}>{f.label}</Label>
            {f.type === "textarea" ? (
              <Textarea
                id={f.name}
                required={f.required}
                value={values[f.name]}
                onChange={(e) => set(f.name, e.target.value)}
              />
            ) : f.type === "select" ? (
              <Select
                value={values[f.name]}
                onValueChange={(v) => set(f.name, v)}
              >
                <SelectTrigger id={f.name}>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {f.options.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={f.name}
                type={f.type}
                required={f.required}
                value={values[f.name]}
                onChange={(e) => set(f.name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      {children}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </DialogFooter>
    </form>
  );
}
