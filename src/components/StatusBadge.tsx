import { STATUS_COR, STATUS_LABEL, type StatusViagem } from "@/lib/status";

export function StatusBadge({ status }: { status: StatusViagem }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COR[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
