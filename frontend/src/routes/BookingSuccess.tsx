import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MinimalShell } from "../components/shells/MinimalShell";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/Icon";
import { api } from "../lib/api";
import type { Lead, Meeting } from "../types";

/** Screen 8 — confirmation of the booked meeting. */
export function BookingSuccess() {
  const { leadId = "" } = useParams();
  const location = useLocation();
  const meeting = (location.state as { meeting?: Meeting } | null)?.meeting;
  const [lead, setLead] = useState<Lead | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    if (!meeting) api.getLead(leadId).then(setLead);
  }, [leadId, meeting]);

  const company = meeting?.company ?? lead?.company ?? "—";
  const when = meeting ? `${meeting.datetime} (${meeting.timezone})` : "Подтверждено";

  return (
    <MinimalShell>
      <div className="flex-1 flex flex-col items-center justify-center px-margin-page -mt-16">
        <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mb-stack-lg">
          <Icon name="check" size={32} fill className="text-white" />
        </div>
        <h1 className="font-display text-display text-on-surface mb-stack-lg">Встреча забронирована</h1>

        <div className="w-full max-w-[440px] bg-surface-container-low border border-border-subtle rounded-xl p-stack-lg text-center space-y-stack-md mb-stack-lg">
          <div>
            <p className="font-label-caps text-label-caps text-text-muted uppercase mb-1">Компания</p>
            <p className="font-body-lg text-body-lg text-on-surface">{company}</p>
          </div>
          <hr className="border-border-subtle" />
          <div>
            <p className="font-label-caps text-label-caps text-text-muted uppercase mb-1">Дата и время</p>
            <p className="font-body-lg text-body-lg text-on-surface">{when}</p>
          </div>
        </div>

        <div className="flex items-center gap-stack-md">
          <Button>
            <Icon name="calendar_add_on" size={18} /> Добавить в календарь
          </Button>
          <Button variant="secondary" onClick={() => nav("/leads")}>
            <Icon name="arrow_back" size={18} /> Назад к списку лидов
          </Button>
        </div>

        <p className="text-text-muted font-body-sm mt-stack-xl">
          Возникли вопросы? <span className="text-primary cursor-pointer">Связаться с поддержкой</span>
        </p>
      </div>
    </MinimalShell>
  );
}
