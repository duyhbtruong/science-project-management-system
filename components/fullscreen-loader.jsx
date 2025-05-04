import { LoaderIcon } from "lucide-react";

export const FullscreenLoader = ({ label }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2">
      <LoaderIcon className="size-6 text-muted-foreground animate-spin" />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
};
