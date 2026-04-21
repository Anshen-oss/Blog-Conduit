
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
      className="btn btn-lg btn-primary pull-xs-right"
      disabled={pending}
    >
      {pending ? 'Publication...' : label}
    </button>
  );
}
