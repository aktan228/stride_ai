import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MinimalShell } from "../components/shells/MinimalShell";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/Icon";
import { api } from "../lib/api";

const PLACEHOLDER = "Например: SaaS-компании 50-200 человек, недавно привлёкшие раунд";

/** Screen 1 — describe the ICP (step 1 of onboarding). */
export function OnboardingICP() {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  async function next() {
    setBusy(true);
    try {
      await api.setICP(value.trim() || PLACEHOLDER);
      nav("/onboarding/product");
    } finally {
      setBusy(false);
    }
  }

  return (
    <MinimalShell right={<Icon name="help" className="text-text-muted" />}>
      <div className="flex-1 flex flex-col items-center justify-center px-margin-page max-w-[760px] mx-auto w-full -mt-16">
        <h1 className="font-display text-display text-on-surface text-center mb-2">
          Опишите вашу целевую аудиторию
        </h1>
        <p className="text-text-muted font-body-md mb-stack-xl text-center">
          Stride AI найдёт компании, которые с наибольшей вероятностью купят ваш продукт
        </p>
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          placeholder={PLACEHOLDER}
          className="w-full border border-border-subtle rounded-lg p-stack-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary resize-none mb-stack-lg placeholder-outline-variant"
        />
        <Button onClick={next} disabled={busy} className="w-full">
          Продолжить <Icon name="arrow_forward" size={18} />
        </Button>
        <p className="font-label-caps text-label-caps text-text-muted uppercase mt-stack-lg">
          Шаг 1 из 2
        </p>
      </div>
    </MinimalShell>
  );
}
