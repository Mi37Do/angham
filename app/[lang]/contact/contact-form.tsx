"use client";

import { Check, ChevronDown } from "lucide-react";
import { useActionState, useState } from "react";
import { dropdownItem, dropdownPanel } from "@/components/ui/dropdown";
import { cn } from "@/lib/cn";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Textarea,
} from "@headlessui/react";
import { submitContact, type ContactState } from "./actions";

type Labels = {
  formTitle: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submit: string;
  sending: string;
  success: string;
  subjects: Record<string, string>;
  errors: Record<"required" | "email" | "tooLong" | "generic", string>;
};

export function ContactForm({
  locale,
  labels,
  defaultSubject = "general",
}: {
  locale: string;
  labels: Labels;
  defaultSubject?: string;
}) {
  const [state, action, pending] = useActionState(submitContact.bind(null, locale), {
    status: "idle",
  } as ContactState);
  const [subject, setSubject] = useState(defaultSubject);

  if (state.status === "success") {
    return (
      <p role="status" className="card bg-gold-soft title-sm border-gold border-s-4 p-6 md:p-8">
        {labels.success}
      </p>
    );
  }

  const errors = state.status === "error" ? state.fields : {};
  const values = state.status === "error" ? state.values : undefined;
  const errorText = (key: keyof typeof errors) =>
    errors[key] && (
      <p className="text-danger mt-1.5 text-sm" role="alert">
        {labels.errors[errors[key]]}
      </p>
    );

  return (
    <form key={JSON.stringify(values)} action={action} className="card p-6 md:p-8" noValidate>
      <Fieldset className="flex flex-col gap-5" disabled={pending}>
        <h2 className="title-xl">{labels.formTitle}</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <Label className="label mb-1.5 block first-letter:uppercase">{labels.name}</Label>
            <Input name="name" defaultValue={values?.name} autoComplete="name" required invalid={!!errors.name} className="input" />
            {errorText("name")}
          </Field>
          <Field>
            <Label className="label mb-1.5 block first-letter:uppercase">{labels.email}</Label>
            <Input
              name="email"
              defaultValue={values?.email}
              type="email"
              autoComplete="email"
              required
              invalid={!!errors.email}
              className="input"
              dir="ltr"
            />
            {errorText("email")}
          </Field>
        </div>

        <Field>
          <Label className="label mb-1.5 block first-letter:uppercase">{labels.subject}</Label>
          <Listbox name="subject" value={subject} onChange={setSubject} invalid={!!errors.subject}>
            <ListboxButton className="input flex items-center justify-between gap-2 text-start">
              <span className="truncate">{labels.subjects[subject]}</span>
              <ChevronDown size={16} className="text-content-muted flex-none" aria-hidden />
            </ListboxButton>
            <ListboxOptions anchor="bottom start" transition className={cn(dropdownPanel, "w-(--button-width)")}>
              {Object.entries(labels.subjects).map(([value, label]) => (
                <ListboxOption key={value} value={value} className={cn(dropdownItem, "group")}>
                  <span className="group-data-selected:text-content-strong flex-1">{label}</span>
                  <Check size={16} className="text-primary invisible group-data-selected:visible" aria-hidden />
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
          {errorText("subject")}
        </Field>

        <Field>
          <Label className="label mb-1.5 block first-letter:uppercase">{labels.message}</Label>
          <Textarea name="message" defaultValue={values?.message} rows={6} required invalid={!!errors.message} className="input h-auto py-3" />
          {errorText("message")}
        </Field>

        {/* Champ piège anti-spam, masqué aux humains. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

        {state.status === "error" && state.generic && (
          <p className="text-danger text-sm" role="alert">
            {labels.errors.generic}
          </p>
        )}

        <Button type="submit" className="btn btn-primary btn-xl self-start">
          {pending ? labels.sending : labels.submit}
        </Button>
      </Fieldset>
    </form>
  );
}
