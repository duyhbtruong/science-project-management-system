import { CheckCircle2Icon, ClockIcon, XCircleIcon } from "lucide-react";

export default function StatusIcon({ status }) {
  switch (status) {
    case "completed":
      return <CheckCircle2Icon className="text-green-500 size-4" />;
    case "pending":
      return <ClockIcon className="text-yellow-500 size-4" />;
    case "removed":
      return <XCircleIcon className="text-red-500 size-4" />;
    default:
      return null;
  }
}
