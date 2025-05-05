import { LoaderIcon } from "lucide-react";

export const FullscreenLoader = ({ label }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2">
      <LoaderIcon className="text-gray-400 size-6 animate-spin" />
      {label && <p className="text-sm text-gray-400">{label}</p>}
    </div>
  );
};
