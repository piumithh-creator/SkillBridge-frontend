export const formatDate = (iso?: string): string =>
  iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

export const formatStipend = (n: number): string => (n > 0 ? `LKR ${n.toLocaleString()}/mo` : "Unpaid");

export const daysLeft = (iso: string): number => Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);

export const timeAgo = (iso: string): string => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export const initials = (name: string): string =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");

export const cn = (...parts: (string | false | null | undefined)[]): string => parts.filter(Boolean).join(" ");

/** Removes empty-string values (recursively) so optional fields are omitted instead of sent as "". */
export const stripEmpty = <T,>(value: T): T => {
  if (Array.isArray(value)) return value.map((v) => stripEmpty(v)) as unknown as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== "" && v !== undefined && !(typeof v === "number" && Number.isNaN(v))).map(([k, v]) => [k, stripEmpty(v)])) as T;
  }
  return value;
};
