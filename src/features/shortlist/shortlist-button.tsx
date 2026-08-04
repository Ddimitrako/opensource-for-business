"use client";

import { Heart } from "lucide-react";
import { useShortlist } from "@/features/shortlist/use-shortlist";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  name: string;
  className?: string;
  withLabel?: boolean;
};

export function ShortlistButton({ slug, name, className, withLabel = false }: Props) {
  const shortlist = useShortlist();
  const selected = shortlist.has(slug);

  return (
    <button
      type="button"
      className={cn("shortlist-button", selected && "is-selected", className)}
      aria-label={selected ? `Remove ${name} from shortlist` : `Add ${name} to shortlist`}
      aria-pressed={selected}
      onClick={() => shortlist.toggle(slug)}
    >
      <Heart size={17} fill={selected ? "currentColor" : "none"} aria-hidden="true" />
      {withLabel && <span>{selected ? "Shortlisted" : "Shortlist"}</span>}
    </button>
  );
}

