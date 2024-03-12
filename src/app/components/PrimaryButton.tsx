import { cn } from "@/lib/utils";
import React from "react";

export default function PrimaryButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 rounded-full bg-red-950 px-3 py-2 font-semibold text-white transition-colors hover:bg-red-900 active:bg-red-900",
        className,
      )}
      {...props}
    />
  );
}
