import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MinimalShell } from "../components/shells/MinimalShell";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/Icon";
import { api } from "../lib/api";

/** Screen 2 — product knowledge base for the Sales Manager agent. */
export function OnboardingProduct() {
  const [what, setWhat] = useState("");
  const [problem, setProblem] = useState("");
  const [pricing, setPricing] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  async function next() {
    setBusy(true);
    try {
      await api.setProduct({ what, problem, pricing });
      nav("/pipeline");
    } finally {
      setBusy(false);
    }
  }

  return (
    <MinimalShell right={<Icon name="help" className="text-text-muted" />}>
      <div className="flex-1 flex flex-col items-center justify-center px-margin-page max-w-[820px] mx-auto w-full py-stack-xl">
        <h1 className="font-display text-display text-on-surface text-center mb-2">
          Расскажите о вашем продукте
        </h1>
        <p className="text-text-muted font-body-md mb-stack-xl text-center">
          Это поможет AI отвечать на вопросы клиентов точно и без ошибок
        </p>

        <div className="w-full space-y-stack-lg">
          <Field label="ЧТО ВЫ ПРОДАЁТЕ?" value={what} onChange={setWhat}
            placeholder="Напр: SaaS-платформа для автоматизации маркетинга в Telegram" />
          <Field label="КАКУЮ ПРОБЛЕМУ РЕШАЕТЕ?" value={problem} onChange={setProblem}
            placeholder="Напр: Помогаем малому бизнесу экономить до 20 часов в неделю на рутинных рассылках" />
          <Field label="ЦЕНЫ / ТАРИФЫ (ОПЦИОНАЛЬНО)" value={pricing} onChange={setPricing}
            placeholder="Напр: Базовый — 1500 руб/мес, Про — 5000 руб/мес" />
        </div>

        <div className="flex flex-col items-center mt-stack-xl w-full">
          <Button onClick={next} disabled={busy} className="px-stack-xl">
            Продолжить <Icon name="arrow_forward" size={18} />
          </Button>
          <p className="font-label-caps text-label-caps text-text-muted uppercase mt-stack-lg">
            Шаг 2 из 2
          </p>
        </div>
      </div>
    </MinimalShell>
  );
}

function Field({
  label, value, onChange, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-stack-sm">
      <label className="font-label-caps text-label-caps text-text-muted uppercase">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder={placeholder}
        className="w-full border border-border-subtle rounded-lg p-stack-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary resize-none placeholder-outline-variant"
      />
    </div>
  );
}
