import React, { useRef, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import LoadingDots from "./LoadingDots";

interface ConfirmationModalProps {
  open: boolean;
  title?: string;
  message: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmationModal({ open, title = "Confirm deletion", message, busy = false, onCancel, onConfirm }: ConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-brand-sky-950/55 backdrop-blur-sm p-4" role="presentation" onClick={busy ? undefined : onCancel}>
      <div className="w-full max-w-md rounded-2xl border border-brand-sky-100 bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="confirmation-title" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="confirmation-title" className="font-serif text-lg font-bold text-brand-sky-950">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">{message}</p>
          </div>
          <button type="button" onClick={onCancel} disabled={busy} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50" aria-label="Close confirmation">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onCancel} disabled={busy} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={busy} className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70">
            {busy ? <LoadingDots label="Deleting" className="justify-center" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useConfirmation() {
  const resolver = useRef<((confirmed: boolean) => void) | null>(null);
  const [request, setRequest] = useState<{ message: string } | null>(null);

  const confirm = (message: string) => new Promise<boolean>((resolve) => {
    resolver.current = resolve;
    setRequest({ message });
  });

  const close = (confirmed: boolean) => {
    if (!confirmed) {
      resolver.current?.(false);
      resolver.current = null;
      setRequest(null);
    }
  };

  const handleConfirm = () => {
    resolver.current?.(true);
    resolver.current = null;
    setRequest(null);
  };

  const modal = <ConfirmationModal open={Boolean(request)} message={request?.message || ""} onCancel={() => close(false)} onConfirm={handleConfirm} />;
  return { confirm, modal };
}
