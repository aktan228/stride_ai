import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SidebarShell } from "../components/shells/SidebarShell";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/Icon";
import { api } from "../lib/api";
import type { Conversation, Lead } from "../types";

/** Screen 6 — lead detail + human approval of the Sales Manager's reply. */
export function ConversationApproval() {
  const { leadId = "" } = useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [conv, setConv] = useState<Conversation | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    api.getLead(leadId).then(setLead);
    api.getConversation(leadId).then((c) => {
      setConv(c);
      if (c.proposed_reply) setReply(c.proposed_reply.proposed_response);
    });
  }, [leadId]);

  async function approve() {
    setBusy(true);
    try {
      setConv(await api.approveReply(leadId));
    } finally {
      setBusy(false);
    }
  }

  const pending = conv?.proposed_reply ?? null;

  return (
    <SidebarShell active="leads">
      <div className="max-w-[1100px]">
        <Link to="/leads" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-stack-md w-fit">
          <Icon name="arrow_back" size={20} />
          <span className="font-body-sm text-body-sm">Назад к лидам</span>
        </Link>

        <h1 className="font-display text-display text-on-surface mb-1">{lead?.company ?? "…"}</h1>
        <div className="flex items-center gap-gutter text-text-muted mb-stack-xl">
          <Meta icon="verified" label="Скор" value={`${lead?.score_100 ?? "—"}/100`} />
          <Divider />
          <Meta icon="payments" label="Раунд" value={lead?.funding ?? "—"} />
          <Divider />
          <Meta icon="groups" label="Размер" value={lead?.size ?? "—"} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-xl">
          {/* Conversation */}
          <section className="lg:col-span-5">
            <div className="flex items-center justify-between mb-stack-md">
              <h3 className="font-label-caps text-label-caps text-text-muted uppercase">Недавний диалог</h3>
              {pending && (
                <span className="px-2 py-0.5 bg-surface-container rounded text-[10px] font-bold text-on-surface-variant">
                  НА ПАУЗЕ
                </span>
              )}
            </div>
            <div className="divide-y divide-border-subtle">
              {conv?.messages.map((m) => (
                <div key={m.id} className="py-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`font-body-sm text-body-sm font-semibold ${m.sender === "lead" ? "text-on-surface" : "text-primary"}`}>
                      {m.sender === "lead" ? "Лид" : "Stride AI"}
                    </span>
                    <span className="font-body-sm text-body-sm text-text-muted">{m.ts}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Approval / next step */}
          <section className="lg:col-span-7">
            {pending ? (
              <>
                <h3 className="font-label-caps text-label-caps text-text-muted uppercase mb-stack-md">
                  Требуется одобрение
                </h3>
                <div className="bg-surface-white border border-border-subtle rounded-xl p-stack-lg flex flex-col gap-stack-lg">
                  <div className="space-y-1">
                    <span className="font-label-caps text-[10px] text-text-muted">ВОЗРАЖЕНИЕ / ВОПРОС</span>
                    <h4 className="font-body-lg text-body-lg font-bold text-on-surface">{pending.objection}</h4>
                  </div>
                  <div className="space-y-stack-sm">
                    <label className="font-label-caps text-[10px] text-text-muted">
                      ПРЕДЛАГАЕМЫЙ ОТВЕТ (МОЖНО РЕДАКТИРОВАТЬ)
                    </label>
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="w-full min-h-[160px] p-stack-md border border-border-subtle rounded-lg font-body-md text-body-md text-on-surface-variant leading-relaxed focus:outline-none focus:border-primary resize-none bg-surface-bright"
                    />
                  </div>
                  <div className="flex items-center gap-gutter">
                    <Button onClick={approve} disabled={busy} className="flex-1 h-11">
                      <Icon name="send" size={18} fill /> Одобрить и отправить
                    </Button>
                    <Button variant="secondary" className="flex-1 h-11" onClick={() => document.querySelector("textarea")?.focus()}>
                      <Icon name="history_edu" size={18} /> Редактировать
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-text-muted bg-surface-container-low p-4 rounded-lg mt-stack-md">
                  <Icon name="info" size={18} />
                  <p className="font-body-sm text-body-sm">
                    После одобрения ответ будет отправлен лиду. Сложные случаи Stride AI эскалирует вам.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-surface-white border border-border-subtle rounded-xl p-stack-lg flex flex-col items-start gap-stack-md">
                <div className="flex items-center gap-2 text-green-600">
                  <Icon name="check_circle" size={20} fill />
                  <span className="font-body-lg font-medium text-on-surface">Ответ отправлен лиду</span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted">
                  Лид готов к встрече. Предложите удобное время на основе доступности календаря.
                </p>
                <Button onClick={() => nav(`/schedule/${leadId}`)}>
                  Запланировать встречу <Icon name="arrow_forward" size={18} />
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </SidebarShell>
  );
}

function Meta({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon name={icon} size={16} />
      <span className="font-body-sm text-body-sm">
        {label}: <span className="text-on-surface font-medium">{value}</span>
      </span>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-3 bg-border-subtle" />;
}
