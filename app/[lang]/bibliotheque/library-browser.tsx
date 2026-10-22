"use client";

import { ArrowUpRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import type { resourceType } from "@/db/schema";
import { cn } from "@/lib/cn";

type ResourceType = (typeof resourceType.enumValues)[number];

export type LibraryItem = {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  author: string | null;
  year: number | null;
  url: string | null;
  rights: string | null;
};

type Labels = {
  search: string;
  filter: string;
  open: string;
  rights: string;
  all: string;
  empty: string;
  types: Record<ResourceType, string>;
};

/* Search and type chips over the catalogue (foundoq.web's filter chips). */
export function LibraryBrowser({ items, labels }: { items: LibraryItem[]; labels: Labels }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ResourceType | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return items.filter(
      (item) =>
        (type === "all" || item.type === type) &&
        (!q ||
          [item.title, item.description, item.author ?? ""].some((v) =>
            v.toLocaleLowerCase().includes(q),
          )),
    );
  }, [items, query, type]);

  const types = ["all", ...Object.keys(labels.types)] as (ResourceType | "all")[];

  return (
    <>
      <div className="flex flex-col gap-4">
        <label className="input flex max-w-xl items-center gap-3">
          <Search size={18} className="text-content-muted flex-none" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.search}
            aria-label={labels.search}
            className="placeholder:text-content-subtle h-full min-w-0 flex-1 bg-transparent outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="×" className="text-content-muted">
              <X size={18} />
            </button>
          )}
        </label>
        <div role="group" aria-label={labels.filter} className="hidden-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)]">
          {types.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={type === option}
              onClick={() => setType(option)}
              className={cn("chip", type === option && "chip-active")}
            >
              {option === "all" ? labels.all : labels.types[option]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={labels.empty} />
      ) : (
        <ul className="mt-10 grid gap-[var(--gutter)] md:grid-cols-2">
          {filtered.map((item) => (
            <li key={item.id} className="card flex flex-col gap-2 p-5 md:p-6">
              <p className="type-meta text-gold-strong font-semibold">
                {labels.types[item.type]}
                {item.year && ` · ${item.year}`}
              </p>
              <h2 className="title auto-dir">{item.title}</h2>
              {item.author && <p className="text-content-muted auto-dir">{item.author}</p>}
              {item.description && <p className="auto-dir flex-1">{item.description}</p>}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                {item.rights && (
                  <span className="type-caption text-content-muted">
                    {labels.rights} : {item.rights}
                  </span>
                )}
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline h-10 bg-surface-2">
                    {labels.open}
                    <ArrowUpRight size={16} className="rtl:-scale-x-100" aria-hidden />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
