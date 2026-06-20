import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TopNavShell } from "../components/shells/TopNavShell";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api";
import type { Slot } from "../types";

/** Screen 7 — pick a real-availability slot and book the meeting. */
export function Schedule() {
  const { leadId = "" } = useParams();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [tz, setTz] = useState("");
  const [selected, setSelected] = useState<Slot | null>(null);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    api.getSlots(leadId).then((r) => {
      setSlots(r.slots);
      setTz(r.timezone);
    });
  }, [leadId]);

  async function book() {
    if (!selected) return;
    setBusy(true);
    try {
      const meeting = await api.book(leadId, selected.id);
      nav(`/success/${leadId}`, { state: { meeting } });
    } finally {
      setBusy(false);
    }
  }

  return (
    <TopNavShell active="schedule">
      <div className="max-w-[1000px] mx-auto w-full">
        <div className="flex flex-col items-center mb-stack-xl">
          <img src="/assets/scheduler.jpg" alt="Scheduler" className="w-24 h-24 object-contain mb-stack-sm" />
          <h1 className="font-display text-display text-on-surface">Запланируйте встречу</h1>
          <p className="text-text-muted font-body-md mt-1">
            Выберите удобное время для синхронизации с нашим AI-движком.
          </p>
        </div>

        <div className="flex items-center justify-between mb-stack-md">
          <span className="font-label-caps text-label-caps text-text-muted uppercase">Доступные слоты</span>
          <span className="font-body-sm text-body-sm text-primary font-medium">Часовой пояс: {tz}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md">
          {slots.map((s) => {
            const active = selected?.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`flex flex-col items-center justify-center py-stack-md rounded-lg border transition-all ${
                  active
                    ? "border-primary text-primary bg-primary/5"
                    : "border-border-subtle bg-surface-container-low text-on-surface-variant hover:border-primary"
                }`}
              >
                <span className="font-body-md text-body-md">{s.day}</span>
                <span className={`font-body-lg text-body-lg ${active ? "font-semibold" : ""}`}>{s.time}</span>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mt-stack-xl bg-surface-container-low border border-border-subtle rounded-xl p-stack-lg flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-stack-md">
              <img src="/assets/scheduler.jpg" alt="" className="w-12 h-12 object-contain" />
              <div>
                <p className="font-body-lg text-body-lg font-medium text-on-surface">Подтвердите встречу</p>
                <p className="font-body-sm text-body-sm text-text-muted">
                  {selected.day} • {selected.time} ({tz})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-stack-md">
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Перенести
              </Button>
              <Button onClick={book} disabled={busy}>
                Добавить в календарь
              </Button>
            </div>
          </div>
        )}
      </div>
    </TopNavShell>
  );
}
