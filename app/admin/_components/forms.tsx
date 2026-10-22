"use client";

import { useActionState } from "react";
import fr from "@/app/[lang]/dictionaries/fr.json";
import type { events, publications, resources } from "@/db/schema";
import { type FormState, saveEvent, savePublication, saveResource } from "../actions";
import { toAlgiersInput } from "../_lib/form";
import { ChoiceField, CoverField, FormError, LocalizedField, PublishedSwitch, SubmitButton, TextField } from "./fields";

const initial: FormState = {};

/* taouzie-ui form: cards of fields under a section head, the actions at the end. */
function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card flex flex-col gap-4 p-4 md:p-5">
      <h2 className="section-head">{title}</h2>
      {children}
    </section>
  );
}

const grid = "grid gap-4 sm:grid-cols-2";

function Footer({ pending, published }: { pending: boolean; published: boolean }) {
  return (
    <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
      <PublishedSwitch defaultChecked={published} />
      <SubmitButton pending={pending}>Enregistrer</SubmitButton>
    </div>
  );
}

export function EventForm({ event }: { event: typeof events.$inferSelect | null }) {
  const [state, action, pending] = useActionState(saveEvent.bind(null, event?.id ?? null), initial);
  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError error={state.error} />
      <FormCard title="Contenu">
        <LocalizedField name="title" label="Titre" defaultValue={event?.title} />
        <LocalizedField name="summary" label="Résumé" defaultValue={event?.summary} multiline rows={3} />
        <LocalizedField name="body" label="Description détaillée" defaultValue={event?.body} multiline rows={10} required={false} />
      </FormCard>
      <FormCard title="Image">
        <CoverField current={event?.coverImage} credit={event?.coverCredit} />
      </FormCard>
      <FormCard title="Informations pratiques">
        <div className={grid}>
          <ChoiceField name="category" label="Catégorie" options={fr.events.categories} defaultValue={event?.category ?? "conference"} />
          <TextField name="location" label="Lieu" defaultValue={event?.location ?? ""} />
          <TextField name="startsAt" label="Début (heure d’Algérie)" type="datetime-local" required defaultValue={toAlgiersInput(event?.startsAt)} />
          <TextField name="endsAt" label="Fin" type="datetime-local" defaultValue={toAlgiersInput(event?.endsAt)} />
          <TextField name="slug" label="Identifiant d’URL" hint="Laisser vide pour le générer à partir du titre." defaultValue={event?.slug ?? ""} dir="ltr" />
        </div>
      </FormCard>
      <Footer pending={pending} published={event?.published ?? false} />
    </form>
  );
}

export function PublicationForm({ publication }: { publication: typeof publications.$inferSelect | null }) {
  const [state, action, pending] = useActionState(savePublication.bind(null, publication?.id ?? null), initial);
  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError error={state.error} />
      <FormCard title="Contenu">
        <LocalizedField name="title" label="Titre" defaultValue={publication?.title} />
        <LocalizedField name="summary" label="Chapeau / résumé" defaultValue={publication?.summary} multiline rows={3} />
        <LocalizedField name="body" label="Texte" defaultValue={publication?.body} multiline rows={16} required={false} />
      </FormCard>
      <FormCard title="Image">
        <CoverField current={publication?.coverImage} credit={publication?.coverCredit} />
      </FormCard>
      <FormCard title="Classement">
        <div className={grid}>
          <ChoiceField name="category" label="Rubrique" options={fr.publications.categories} defaultValue={publication?.category ?? "actualite"} />
          <TextField name="author" label="Auteur" defaultValue={publication?.author ?? ""} />
          <TextField name="publishedAt" label="Date de publication" hint="Vide : date du jour à la publication." type="datetime-local" defaultValue={toAlgiersInput(publication?.publishedAt)} />
          <TextField name="slug" label="Identifiant d’URL" hint="Laisser vide pour le générer à partir du titre." defaultValue={publication?.slug ?? ""} dir="ltr" />
        </div>
      </FormCard>
      <Footer pending={pending} published={publication?.published ?? false} />
    </form>
  );
}

export function ResourceForm({ resource }: { resource: typeof resources.$inferSelect | null }) {
  const [state, action, pending] = useActionState(saveResource.bind(null, resource?.id ?? null), initial);
  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError error={state.error} />
      <FormCard title="Contenu">
        <LocalizedField name="title" label="Titre" defaultValue={resource?.title} />
        <LocalizedField name="description" label="Description" defaultValue={resource?.description} multiline required={false} />
      </FormCard>
      <FormCard title="Notice">
        <div className={grid}>
          <ChoiceField name="type" label="Type" options={fr.library.types} defaultValue={resource?.type ?? "livre"} />
          <TextField name="author" label="Auteur / interprète" defaultValue={resource?.author ?? ""} />
          <TextField name="year" label="Année" type="number" defaultValue={resource?.year ?? ""} />
          <TextField name="url" label="Lien vers la ressource" type="url" placeholder="https://" defaultValue={resource?.url ?? ""} dir="ltr" />
          <TextField name="rights" label="Droits de diffusion" hint="Ex. : domaine public, autorisation de l’ayant droit…" defaultValue={resource?.rights ?? ""} />
        </div>
      </FormCard>
      <Footer pending={pending} published={resource?.published ?? false} />
    </form>
  );
}
