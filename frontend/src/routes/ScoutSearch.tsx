import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MinimalShell } from "../components/shells/MinimalShell";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api";

const CHIPS = ["ГЛОБАЛЬНЫЕ ДАННЫЕ", "AI ФИЛЬТРАЦИЯ", "LEAD GENIUS"];

/** Screen 9 — empty state / start a fresh Scout run. */
export function ScoutSearch() {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  async function search() {
    setBusy(true);
    try {
      if (value.trim()) await api.setICP(value.trim());
      nav("/pipeline");
    } finally {
      setBusy(false);
    }
  }

  return (
    <MinimalShell>
      <div className="flex-1 flex flex-col items-center justify-center px-margin-page max-w-[720px] mx-auto w-full -mt-16">
        <p className="font-body-md text-on-surface-variant mb-stack-sm self-start">
          Опишите вашу целевую аудиторию
        </p>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Например: SaaS-компании 50-200 человек, недавно привлёкшие раунд"
          className="w-full border-2 border-primary rounded-lg px-stack-md py-3 font-body-lg text-body-lg text-on-surface focus:outline-none mb-stack-md placeholder-outline-variant"
        />
        <Button onClick={search} disabled={busy} className="w-full py-3">
          Начать поиск
        </Button>
        <p className="text-text-muted font-body-sm mt-stack-xl">
          Нажмите <kbd className="px-1.5 py-0.5 border border-border-subtle rounded text-[11px]">Enter</kbd>, чтобы начать поиск
        </p>
        <div className="flex items-center gap-stack-lg mt-stack-md">
          {CHIPS.map((c) => (
            <span key={c} className="font-label-caps text-label-caps text-text-muted/70 uppercase tracking-widest">
              {c}
            </span>
          ))}
        </div>
      </div>
    </MinimalShell>
  );
}
