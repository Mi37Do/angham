"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { FormError, SubmitButton, TextField } from "../_components/fields";
import { PasswordInput } from "../_components/ui/password-input";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="card card-shadow flex flex-col gap-4 p-5">
      <h1 className="pixa-title">Administration</h1>
      <FormError error={state.error} />
      <TextField name="email" label="Adresse e-mail" type="email" autoComplete="username" required dir="ltr" />
      <div className="form-control">
        <label htmlFor="password" className="label is-required">
          Mot de passe
        </label>
        <PasswordInput id="password" name="password" autoComplete="current-password" required toggleLabel="Afficher le mot de passe" />
      </div>
      <SubmitButton pending={pending}>Se connecter</SubmitButton>
    </form>
  );
}
