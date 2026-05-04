'use client';

import { logoutAction } from '@/actions/auth.actions';
import { updateUser, type UpdateUserState } from '@/lib/actions/user.actions';
import { useActionState } from 'react';

interface Props {
  user: {
    email: string;
    username: string;
    bio: string | null;
    image: string | null;
  };
}

export function SettingsForm({ user }: Props) {
  // useActionState : wraps la Server Action avec gestion d'état automatique
  // state    → résultat retourné par updateUser (success, error)
  // action   → fonction à passer au <form action={...}>
  // isPending → true pendant l'appel réseau
  const [state, action, isPending] = useActionState<UpdateUserState | null, FormData>(
    updateUser,
    null,
  );

  return (
    <>
      {/* Message d'erreur */}
      {state?.error && (
        <ul className="error-messages">
          <li>{state.error}</li>
        </ul>
      )}

      {/* Message de succès */}
      {state?.success && (
        <p className="text-success">✅ Profil mis à jour avec succès !</p>
      )}

      {/* Le formulaire utilise action= (pas onSubmit=) pour les Server Actions */}
      <form action={action}>
        {/* Image URL */}
        <fieldset>
          <fieldset className="form-group">
            <input
              name="image"
              className="form-control"
              type="url"
              placeholder="URL of profile picture"
              defaultValue={user.image ?? ''}
            />
          </fieldset>

          {/* Username */}
          <fieldset className="form-group">
            <input
              name="username"
              className="form-control form-control-lg"
              type="text"
              placeholder="Your Name"
              defaultValue={user.username}
              required
            />
          </fieldset>

          {/* Bio */}
          <fieldset className="form-group">
            <textarea
              name="bio"
              className="form-control form-control-lg"
              rows={8}
              placeholder="Short bio about you"
              defaultValue={user.bio ?? ''}
            />
          </fieldset>

          {/* Email */}
          <fieldset className="form-group">
            <input
              name="email"
              className="form-control form-control-lg"
              type="email"
              placeholder="Email"
              defaultValue={user.email}
              required
            />
          </fieldset>

          {/* Nouveau mot de passe (optionnel) */}
          <fieldset className="form-group">
            <input
              name="password"
              className="form-control form-control-lg"
              type="password"
              placeholder="New Password (leave blank to keep current)"
            />
          </fieldset>

          {/* Bouton Submit — désactivé pendant l'appel */}
          <button
            className="btn btn-lg btn-primary pull-xs-right"
            type="submit"
            disabled={isPending}
          >
            {isPending ? 'Updating...' : 'Update Settings'}
          </button>
        </fieldset>
      </form>

      {/* Séparateur */}
      <hr />

      {/* Bouton Logout — appelle la Server Action logout directement */}
      <form action={logoutAction}>
        <button className="btn btn-outline-danger" type="submit">
          Or click here to logout.
        </button>
      </form>
    </>
  );
}
