import { assetUrl } from "../../services/api";
import { initials } from "../../utils/format";

export const Avatar = ({ name, src, size = 40 }: { name: string; src?: string; size?: number }) => {
  const url = assetUrl(src);
  return url ? (
    <img src={url} alt={name} width={size} height={size} className="rounded-xl object-cover" style={{ width: size, height: size }} />
  ) : (
    <div className="flex items-center justify-center rounded-xl bg-primary-100 font-bold text-primary" style={{ width: size, height: size, fontSize: size * 0.38 }} aria-label={name}>
      {initials(name) || "?"}
    </div>
  );
};
