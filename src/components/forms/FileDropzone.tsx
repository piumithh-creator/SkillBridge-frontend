import { UploadCloud } from "lucide-react";
import { useDropzone, type Accept } from "react-dropzone";
import toast from "react-hot-toast";

interface Props { label: string; accept: Accept; maxSizeMB: number; onFile: (f: File) => void; busy?: boolean; hint?: string }

export const FileDropzone = ({ label, accept, maxSizeMB, onFile, busy, hint }: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept, maxSize: maxSizeMB * 1024 * 1024, multiple: false, disabled: busy,
    onDropAccepted: (files) => files[0] && onFile(files[0]),
    onDropRejected: (r) => toast.error(r[0]?.errors[0]?.code === "file-too-large" ? `File must be under ${maxSizeMB}MB` : "Unsupported file type")
  });
  return (
    <div {...getRootProps()} className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition ${isDragActive ? "border-primary bg-primary-50" : "border-slate-300 hover:border-primary/60"} ${busy ? "opacity-60" : ""}`}>
      <input {...getInputProps()} aria-label={label} />
      <UploadCloud className="mx-auto mb-2 h-8 w-8 text-primary" />
      <p className="text-sm font-semibold">{busy ? "Uploading…" : label}</p>
      <p className="mt-1 text-xs text-slate-500">{hint ?? `Max ${maxSizeMB}MB`}</p>
    </div>
  );
};
