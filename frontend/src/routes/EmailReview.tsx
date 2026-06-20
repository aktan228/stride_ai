import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TopNavShell } from "../components/shells/TopNavShell";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/Icon";
import { api } from "../lib/api";
import type { EmailDraft } from "../types";

/** Screen 5 — human-in-the-loop review of the first outreach email. */
export function EmailReview() {
  const { leadId = "" } = useParams();
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    api.getDraft(leadId).then((d) => {
      setDraft(d);
      setSubject(d.subject);
      setBody(d.body);
    });
  }, [leadId]);

  async function approve() {
    setBusy(true);
    try {
      await api.editDraft(leadId, { subject, body });
      await api.approveDraft(leadId);
      setSent(true);
      setTimeout(() => nav("/leads"), 1100);
    } finally {
      setBusy(false);
    }
  }

  return (
    <TopNavShell active="pipeline">
      <div className="max-w-[800px] mx-auto w-full flex flex-col items-center">
        <div className="flex flex-col items-center mb-stack-xl animate-fade-in">
          <img src="/assets/writer.jpg" alt="Writer" className="w-28 h-28 object-contain mb-stack-sm" />
          <h1 className="font-display text-display text-on-surface">Проверьте черновик письма</h1>
          <p className="font-body-sm text-body-sm text-text-muted mt-1">
            Создано {draft?.created_by ?? "Stride AI Копирайтером"}
          </p>
        </div>

        <div className="w-full bg-surface-white border border-border-subtle rounded-lg p-stack-lg space-y-stack-md focus-within:border-primary transition-colors">
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-text-muted">ТЕМА</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border-none p-0 font-headline-md text-headline-md text-on-surface focus:outline-none bg-transparent"
            />
          </div>
          <hr className="border-border-subtle" />
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-text-muted">ТЕКСТ</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full border-none p-0 font-body-lg text-body-lg text-on-surface focus:outline-none resize-none bg-transparent leading-relaxed"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-stack-md mt-stack-xl">
          <Button onClick={approve} disabled={busy || sent} className={sent ? "!bg-green-600" : "px-stack-xl"}>
            {sent ? (
              <>
                <Icon name="check" size={18} /> Отправлено
              </>
            ) : (
              "Одобрить и отправить"
            )}
          </Button>
          <Button
            variant="secondary"
            className="px-stack-xl"
            onClick={() => document.querySelector("textarea")?.focus()}
          >
            Редактировать
          </Button>
        </div>

        <div className="mt-stack-lg flex items-center gap-1.5 text-text-muted">
          <Icon name="info" size={14} />
          <p className="font-body-sm text-body-sm italic">
            Нажмите на любое поле выше, чтобы внести правки вручную перед отправкой.
          </p>
        </div>
      </div>
    </TopNavShell>
  );
}
