// Client Component minimal — uniquement pour useFormStatus
'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  label: string;
}

export function SubmitButton({ label }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="px-6 py-3 text-lg font-semibold bg-brand text-white rounded hover:bg-brand-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? 'Publication...' : label}
    </button>
  );
}
