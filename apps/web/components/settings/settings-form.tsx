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

const inputClass = 'w-full px-4 py-3 text-base border border-conduit-border rounded outline-none transition-colors placeholder:text-conduit-muted focus:border-brand focus:ring-1 focus:ring-brand'

export function SettingsForm({ user }: Props) {
  const [state, action, isPending] = useActionState<UpdateUserState | null, FormData>(
    updateUser,
    null,
  );

  return (
    <>
      {/* Message d'erreur */}
      {state?.error && (
        <ul className="bg-danger-light border border-danger rounded px-4 py-3 mb-4">
          <li className="text-sm text-danger">{state.error}</li>
        </ul>
      )}

      {/* Message de succès */}
      {state?.success && (
        <p className="text-sm text-brand mb-4">✅ Profil mis à jour avec succès !</p>
      )}

      <form action={action}>
        <fieldset className="flex flex-col gap-4">

          {/* Image URL */}
          <input
            name="image"
            type="url"
            className={inputClass}
            placeholder="URL of profile picture"
            defaultValue={user.image ?? ''}
          />

          {/* Username */}
          <input
            name="username"
            type="text"
            className={inputClass}
            placeholder="Your Name"
            defaultValue={user.username}
            required
          />

          {/* Bio */}
          <textarea
            name="bio"
            rows={8}
            className={`${inputClass} resize-y`}
            placeholder="Short bio about you"
            defaultValue={user.bio ?? ''}
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            className={inputClass}
            placeholder="Email"
            defaultValue={user.email}
            required
          />

          {/* Nouveau mot de passe */}
          <input
            name="password"
            type="password"
            className={inputClass}
            placeholder="New Password (leave blank to keep current)"
          />

          {/* Bouton Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-3 text-lg font-semibold bg-brand text-white rounded hover:bg-brand-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? 'Updating...' : 'Update Settings'}
            </button>
          </div>

        </fieldset>
      </form>

      {/* Séparateur */}
      <hr className="border-conduit-border my-6" />

      {/* Bouton Logout */}
      <form action={logoutAction}>
        <button
          type="submit"
          className="px-4 py-2 text-sm border border-danger text-danger rounded hover:bg-danger hover:text-white transition-colors"
        >
          Or click here to logout.
        </button>
      </form>
    </>
  );
}
