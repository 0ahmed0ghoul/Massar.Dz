export function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return (
      <p className="mt-1 flex items-center gap-1 text-[11px] text-red-400">
        <span className="inline-block h-1 w-1 rounded-full bg-red-400" />
        {message}
      </p>
    );
  }