import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarShell } from "../components/shells/SidebarShell";
import { LeadCard } from "../components/LeadCard";
import { Icon } from "../components/Icon";
import { api } from "../lib/api";
import type { Lead } from "../types";

/** Screen 4 — all leads with their funnel status. */
export function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    api.listLeads().then(setLeads);
  }, []);

  return (
    <SidebarShell active="leads">
      <div className="max-w-3xl">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="font-display text-display text-on-surface mb-1">Список лидов</h1>
            <p className="font-body-md text-body-md text-text-muted">
              {leads.length} активных контактов ожидают действий
            </p>
          </div>
          <button
            onClick={() => nav("/search")}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-button-text text-button-text hover:opacity-90 transition-opacity"
          >
            <Icon name="add" size={18} /> Новый лид
          </button>
        </div>

        <div className="space-y-stack-sm">
          {leads.map((l) => (
            <LeadCard key={l.id} lead={l} onClick={() => nav(`/leads/${l.id}`)} />
          ))}
        </div>

        <div className="mt-stack-xl flex items-center justify-between border-t border-border-subtle pt-stack-lg">
          <span className="font-body-sm text-body-sm text-text-muted">
            Показано {leads.length} из {leads.length} лидов
          </span>
          <div className="flex gap-2">
            <PageBtn><Icon name="chevron_left" size={18} /></PageBtn>
            <button className="px-3 h-8 flex items-center justify-center rounded border border-accent-blue text-accent-blue font-medium text-body-sm bg-accent-blue/5">
              1
            </button>
            <PageBtn>2</PageBtn>
            <PageBtn>3</PageBtn>
            <PageBtn><Icon name="chevron_right" size={18} /></PageBtn>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function PageBtn({ children }: { children: ReactNode }) {
  return (
    <button className="min-w-8 h-8 px-3 flex items-center justify-center rounded border border-border-subtle hover:bg-surface-container-low text-on-surface-variant font-medium text-body-sm transition-colors">
      {children}
    </button>
  );
}
