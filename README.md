# Stride AI — мультиагентная автоматизация B2B-продаж (хакатон-прототип)

Команда AI-агентов закрывает top-of-funnel: поиск компаний → квалификация →
персонализированное письмо → **одобрение человеком** → отправка → ведение диалога
→ запись встречи. Ключевая идея — *human-in-the-loop* и **видимый процесс** работы
агентов в реальном времени.

> **Статус этапа:** весь функционал работает на **моках/хардкоде** (курируемый
> JSON-датасет, скриптованный пайплайн, заглушки отправки письма и календаря).
> Архитектура спроектирована с чистыми «швами», чтобы позже подменить моки на
> реальные Claude + Gmail/Calendar без переписывания (см. ниже).

## Стек

- **Backend:** Python + FastAPI, SSE для live-пайплайна (без БД — in-memory store).
- **Frontend:** React + Vite + TypeScript + Tailwind (токены из макетов/`DESIGN.md`).

## Запуск

Нужны два процесса. Backend на `:8000`, frontend на `:5173` (проксирует `/api` на backend).

```bash
# 1) Backend
cd backend
py -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000

# 2) Frontend (в отдельном терминале)
cd frontend
npm install
npm run dev
```

Открыть http://localhost:5173 → начнётся онбординг.

Смоук-тест бэкенда (без сервера): `cd backend && .venv\Scripts\python smoke_test.py`

## Демо-сценарий (порядок экранов)

| Маршрут | Экран | Что происходит |
|---|---|---|
| `/onboarding/icp` | Онбординг ICP | Описание целевой аудитории |
| `/onboarding/product` | Онбординг продукта | База знаний для Sales Manager |
| `/pipeline` | **Конвейер агентов (live)** | SSE: Скаут→Аналитик→Копирайтер, компании появляются в эфире |
| `/email/acme` | Проверка письма | Human-in-the-loop: редактирование и «Одобрить и отправить» |
| `/leads` | Список лидов | Acme добавлен сверху со статусом «Требует внимания» |
| `/leads/acme` | Диалог + approval | Лид спросил про интеграцию с CRM → одобрить ответ |
| `/schedule/acme` | Запись на встречу | Выбор слота из доступных |
| `/success/acme` | Успех | Подтверждение брони |
| `/search` | Empty state | Запуск нового поиска Scout |

## Архитектура (моки сейчас → реальное позже)

Каждый агент/интеграция — сервис с интерфейсом (`backend/app/services/interfaces.py`)
и `Mock`-реализацией. Переключатель — флаг `USE_MOCKS` в `backend/app/config.py` +
фабрики в `backend/app/services/__init__.py` (внедряются через `Depends`). Чтобы
подключить реальное, нужно дописать не-mock реализации и снять `USE_MOCKS`:

| Сервис | Сейчас | Позже |
|---|---|---|
| `Scout` | JSON-датасет (`app/data/companies.json`) | web search (Tavily / Claude) |
| `Analyst` | хардкод-скоры | Claude `claude-sonnet-4-6` (1 вызов/компанию) |
| `Writer` | шаблон/датасет | Claude `claude-opus-4-8` |
| `SalesManager` | заготовленный ответ | Claude + база знаний продукта |
| `EmailService` | лог + пометка sent | Gmail SMTP / API |
| `CalendarService` | слоты из `slots.json` | Google Calendar `freebusy` |
| `Orchestrator` | скриптованная SSE-лента | реальная последовательность вызовов агентов |

Курируемый датасет: `backend/app/data/*.json` — источник правды для стабильного демо.

## Структура

```
backend/   FastAPI: app/{main,config,store,models}.py, app/api/*, app/services/*, app/data/*.json
frontend/  React: src/routes/* (экраны), src/components/* (shell+UI), src/lib/{api,usePipelineSSE}.ts
```
