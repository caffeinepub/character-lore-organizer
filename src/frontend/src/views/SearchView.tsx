import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchCharacters } from "@/store/characters";
import type { Character } from "@/store/characters";
import { ArrowLeft, Clock, Search, Shield, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const HISTORY_KEY = "searchHistory";
const MAX_HISTORY = 3;

function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

function saveSearchHistory(history: string[]): void {
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history.slice(0, MAX_HISTORY)),
  );
}

function addToHistory(term: string): void {
  if (!term.trim()) return;
  const existing = getSearchHistory();
  const deduped = [term, ...existing.filter((h) => h !== term)];
  saveSearchHistory(deduped.slice(0, MAX_HISTORY));
}

interface SearchViewProps {
  onBack: () => void;
  onSelectCharacter: (id: string) => void;
}

export default function SearchView({
  onBack,
  onSelectCharacter,
}: SearchViewProps) {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>(() => getSearchHistory());
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = searchCharacters(query);

  // Save to history when query is non-empty and user pauses (300ms debounce)
  useEffect(() => {
    if (!query.trim()) return;
    const t = setTimeout(() => {
      addToHistory(query.trim());
      setHistory(getSearchHistory());
    }, 800);
    return () => clearTimeout(t);
  }, [query]);

  const applyHistory = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  const showHistory = history.length > 0 && (inputFocused || !query.trim());

  const highlight = (text: string, q: string) => {
    if (!q.trim()) return text;
    const regex = new RegExp(
      `(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    const parts = text.split(regex);
    // Use index keys here — text fragment positions are stable within a single render
    return parts.map((part, i) => {
      const key = `${i}-${part.slice(0, 8)}`;
      if (regex.test(part)) {
        return (
          <mark key={key} className="bg-gold/30 text-gold rounded-sm px-0.5">
            {part}
          </mark>
        );
      }
      return <span key={key}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center gap-4 px-6 py-4 border-b border-border bg-background/90 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          data-ocid="search.back.button"
          className="gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground shrink-0"
        >
          <ArrowLeft size={14} />
          Back
        </Button>

        <div className="relative flex-1 max-w-2xl mx-auto">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            ref={inputRef}
            data-ocid="search.search_input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 150)}
            placeholder="Search characters, lore, backstory, traits..."
            className="pl-9 text-sm bg-card border-border"
            autoFocus
          />
        </div>
      </header>

      {/* Search history chips */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            key="history-bar"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border bg-card/40 px-6 py-2 overflow-hidden"
          >
            <div className="max-w-2xl mx-auto flex items-center gap-2 flex-wrap">
              <Clock size={12} className="text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider shrink-0">
                Recent:
              </span>
              {history.map((term, i) => (
                <button
                  key={term}
                  type="button"
                  data-ocid={`search.history.item.${i + 1}`}
                  onClick={() => applyHistory(term)}
                  className="px-2.5 py-1 rounded-full text-xs border border-gold/30 bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
                >
                  {term}
                </button>
              ))}
              <button
                type="button"
                onClick={clearHistory}
                className="ml-auto text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
                title="Clear history"
              >
                <X size={11} />
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        {!query.trim() ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest">
              Enter a name, word, or phrase
            </p>
            <p className="text-xs text-muted-foreground/60">
              Searches names, factions, lore, backstory, traits, and fun facts
            </p>
          </motion.div>
        ) : results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="search.empty_state"
            className="flex flex-col items-center justify-center py-20 text-center gap-3"
          >
            <p className="text-sm text-muted-foreground">
              No results for{" "}
              <span className="text-foreground font-medium">"{query}"</span>
            </p>
            <p className="text-xs text-muted-foreground/60">
              Try searching a different word or phrase
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
              {results.length} {results.length === 1 ? "result" : "results"} for
              "{query}"
            </p>
            <AnimatePresence>
              {results.map(({ character, matchedFields }, idx) => (
                <SearchResultCard
                  key={character.id}
                  character={character}
                  matchedFields={matchedFields}
                  query={query}
                  index={idx}
                  onSelect={() => onSelectCharacter(character.id)}
                  highlight={highlight}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

interface SearchResultCardProps {
  character: Character;
  matchedFields: string[];
  query: string;
  index: number;
  onSelect: () => void;
  highlight: (text: string, q: string) => React.ReactNode;
}

function SearchResultCard({
  character,
  matchedFields,
  query,
  index,
  onSelect,
  highlight,
}: SearchResultCardProps) {
  // Get a snippet of text with the match
  const getSnippet = (text: string, q: string, maxLen = 120) => {
    const lower = text.toLowerCase();
    const idx = lower.indexOf(q.toLowerCase());
    if (idx === -1)
      return text.slice(0, maxLen) + (text.length > maxLen ? "..." : "");
    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + q.length + 80);
    return (
      (start > 0 ? "..." : "") +
      text.slice(start, end) +
      (end < text.length ? "..." : "")
    );
  };

  // Build snippets for matched fields
  const snippets: { field: string; text: string }[] = [];
  if (matchedFields.includes("lore") && character.lore) {
    snippets.push({ field: "lore", text: getSnippet(character.lore, query) });
  }
  if (matchedFields.includes("backstory") && character.backstory) {
    snippets.push({
      field: "backstory",
      text: getSnippet(character.backstory, query),
    });
  }
  if (matchedFields.includes("traits")) {
    const matched = character.traits.filter((t) =>
      t.toLowerCase().includes(query.toLowerCase()),
    );
    snippets.push({ field: "traits", text: matched.join(", ") });
  }
  if (matchedFields.includes("fun facts")) {
    const matched = character.funFacts.filter((f) =>
      f.toLowerCase().includes(query.toLowerCase()),
    );
    snippets.push({
      field: "fun facts",
      text: getSnippet(matched[0] || "", query),
    });
  }
  if (matchedFields.includes("description") && character.shortDescription) {
    snippets.push({
      field: "description",
      text: getSnippet(character.shortDescription, query),
    });
  }

  return (
    <motion.button
      data-ocid={`search.result.item.${index + 1}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onSelect}
      className="w-full text-left rounded-lg border border-border bg-card hover:border-gold/40 hover:bg-card/80 transition-all duration-200 overflow-hidden group"
    >
      <div className="flex gap-4 p-4">
        {/* Portrait */}
        <div
          className="w-14 h-14 rounded-md shrink-0 overflow-hidden border border-border"
          style={{ background: `${character.bgColor}80` }}
        >
          {character.portraitImageUrl ? (
            <img
              src={character.portraitImageUrl}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={20} className="text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="font-semibold text-foreground mb-0.5">
            {highlight(character.name, query)}
          </h3>

          {/* Faction + value */}
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shield size={10} />
              {highlight(character.faction, query)}
            </span>
            <span className="text-xs text-muted-foreground">
              · {character.powerTier}
            </span>
          </div>

          {/* Matched field badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {matchedFields.map((f) => (
              <Badge
                key={f}
                variant="outline"
                className="text-xs border-gold/30 text-gold/70 bg-gold/5 capitalize"
              >
                {f}
              </Badge>
            ))}
          </div>

          {/* Snippets */}
          {snippets.slice(0, 2).map((s) => (
            <p
              key={s.field}
              className="text-xs text-muted-foreground mt-1 line-clamp-2"
            >
              <span className="uppercase tracking-wider text-muted-foreground/60 mr-1">
                {s.field}:
              </span>
              {highlight(s.text, query)}
            </p>
          ))}
        </div>

        {/* Arrow indicator */}
        <div className="shrink-0 flex items-center text-muted-foreground/30 group-hover:text-gold/50 transition-colors">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <title>Navigate</title>
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </motion.button>
  );
}
