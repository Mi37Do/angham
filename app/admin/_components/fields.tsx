"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useId, useState } from "react";
import type { Localized } from "@/db/schema";
import { cn } from "@/lib/cn";
import { ListBox } from "./ui/list-box";
import { Switcher } from "./ui/switcher";

// Champs de formulaire en classes taouzie-ui : .form-control > .label + .input.
// L’astérisque « obligatoire » vient de l’attribut `required` (voir admin.css).

const languages = [
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "es", label: "Español", dir: "ltr" },
] as const;

/** Champ traduit : un onglet par langue, le français est obligatoire sauf champ facultatif. */
export function LocalizedField({
  name,
  label,
  defaultValue,
  multiline = false,
  rows = 4,
  required = true,
}: {
  name: string;
  label: string;
  defaultValue?: Localized | null;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}) {
  return (
    <TabGroup className="form-control">
      <div className="flex items-end justify-between gap-4">
        <span className={cn("label", required && "is-required")}>{label}</span>
        <TabList className="flex gap-1">
          {languages.map((l) => (
            <Tab
              key={l.code}
              className={({ selected }) =>
                cn("btn-xs btn-choice focus-ring px-2 focus:outline-none", selected && "btn-choice-active")
              }
            >
              {l.code.toUpperCase()}
            </Tab>
          ))}
        </TabList>
      </div>
      <TabPanels>
        {languages.map((l) => (
          // unmount={false} : les onglets masqués restent dans le formulaire et sont envoyés.
          <TabPanel key={l.code} unmount={false}>
            {multiline ? (
              <textarea
                name={`${name}.${l.code}`}
                aria-label={`${label} (${l.label})`}
                dir={l.dir}
                lang={l.code}
                rows={rows}
                defaultValue={defaultValue?.[l.code] ?? ""}
                required={required && l.code === "fr"}
                className="textarea"
              />
            ) : (
              <input
                name={`${name}.${l.code}`}
                aria-label={`${label} (${l.label})`}
                dir={l.dir}
                lang={l.code}
                defaultValue={defaultValue?.[l.code] ?? ""}
                required={required && l.code === "fr"}
                className="input"
              />
            )}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}

export function TextField({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className="form-control">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input id={id} {...props} className="input" />
      {hint && <p className="text-muted text-[0.7rem]">{hint}</p>}
    </div>
  );
}

export function ChoiceField<T extends string>({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: Record<T, string>;
  defaultValue: T;
}) {
  return (
    <div className="form-control">
      <span className="label is-required">{label}</span>
      <ListBox name={name} options={options} defaultValue={defaultValue} ariaLabel={label} />
    </div>
  );
}

export function PublishedSwitch({ defaultChecked }: { defaultChecked: boolean }) {
  return (
    <Switcher
      name="published"
      defaultChecked={defaultChecked}
      label={(on) => (on ? "Publié sur le site" : "Brouillon (non visible sur le site)")}
    />
  );
}

export function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="text-danger-strong rounded-xl bg-red-500/10 px-3 py-2.5">
      {error}
    </p>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={pending} className="btn btn-primary justify-center px-5">
      {pending ? <span className="loader !w-5 invert" aria-hidden /> : children}
    </button>
  );
}

/** Cover image: the current picture, a file picker to replace it, its credit, and a way to remove it. */
export function CoverField({ current, credit }: { current?: string | null; credit?: string | null }) {
  const id = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const shown = preview ?? current ?? null;
  return (
    <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
      <div className="bg-app border-edge relative aspect-[4/5] overflow-hidden border">
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element -- local preview of a file not yet uploaded
          <img src={shown} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-muted absolute inset-0 flex items-center justify-center text-[0.7rem] uppercase">
            Aucune image
          </span>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="form-control">
          <label htmlFor={id} className="label">
            {current ? "Remplacer l’image" : "Image"}
          </label>
          <input
            id={id}
            name="cover"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="input py-1.5 file:me-3 file:rounded-lg file:border-0 file:bg-[var(--primary-90)] file:px-3 file:py-1 file:text-[0.75rem]"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
          />
          <p className="text-muted text-[0.7rem]">JPEG, PNG, WebP ou AVIF, 10 Mo maximum. Redimensionnée à 1600 px.</p>
        </div>
        <TextField
          name="coverCredit"
          label="Crédit photo"
          hint="Ex. : Nom du photographe · licence"
          defaultValue={credit ?? ""}
        />
        {current && (
          <label className="flex items-center gap-2 text-[0.8rem]">
            <input type="checkbox" name="removeCover" className="accent-[var(--primary-2)]" />
            Retirer l’image actuelle
          </label>
        )}
      </div>
    </div>
  );
}
