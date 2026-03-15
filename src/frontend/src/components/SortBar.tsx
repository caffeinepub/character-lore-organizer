import type { SortField } from "@/store/characters";
import { ArrowDown, ArrowUp } from "lucide-react";

interface SortBarProps {
  sortBy: SortField;
  direction: "asc" | "desc";
  onSort: (field: SortField) => void;
}

const SORT_OPTIONS: { label: string; field: SortField }[] = [
  { label: "Faction", field: "faction" },
  { label: "Name", field: "name" },
  { label: "Tier", field: "powerTier" },
  { label: "Fame", field: "fame" },
  { label: "Created", field: "createdAt" },
  { label: "Updated", field: "updatedAt" },
];

export default function SortBar({ sortBy, direction, onSort }: SortBarProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-xs text-muted-foreground uppercase tracking-widest mr-1 shrink-0">
        Sort:
      </span>
      {SORT_OPTIONS.map(({ label, field }) => {
        const active = sortBy === field;
        return (
          <button
            type="button"
            key={field}
            data-ocid={`sort.${field}.button`}
            onClick={() => onSort(field)}
            className={[
              "flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium uppercase tracking-wider transition-all duration-200",
              active
                ? "bg-gold/20 text-gold border border-gold/40"
                : "text-muted-foreground border border-transparent hover:text-foreground hover:border-border",
            ].join(" ")}
          >
            {label}
            {active &&
              (direction === "asc" ? (
                <ArrowUp size={10} />
              ) : (
                <ArrowDown size={10} />
              ))}
          </button>
        );
      })}
    </div>
  );
}
