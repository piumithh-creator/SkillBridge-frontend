import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div role="alert" className="flex flex-col items-center rounded-2xl border border-rose-200 bg-rose-50/60 px-6 py-12 text-center">
    <AlertTriangle className="mb-3 h-8 w-8 text-rose-500" />
    <h3 className="font-bold text-rose-800">Something went wrong</h3>
    <p className="mt-1 max-w-md text-sm text-rose-700">{message}</p>
    {onRetry && <Button className="mt-4" variant="outline" size="sm" onClick={onRetry}>Try again</Button>}
  </div>
);
