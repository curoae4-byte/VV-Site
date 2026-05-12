# VV — VALERY VISUALS

Лендинг/портфолио на React + Vite с анимациями (GSAP/ScrollTrigger + Lenis) и UI‑анимациями на Motion.

## Стек

- React 19 + TypeScript
- Vite 7
- Tailwind CSS
- GSAP (+ ScrollTrigger) + Lenis (скролл‑сцены)
- Motion (микро‑анимации/модалки/hover)
- React Router (`/`, `/portfolio`)

## Быстрый старт

```bash
npm install
npm run dev
```

## Команды

```bash
npm run dev      # dev-сервер
npm run build    # сборка в dist
npm run preview  # предпросмотр сборки
```

## Структура проекта (коротко)

- `src/main.tsx` — вход, роутинг, оверлеи
- `src/App.tsx` — главная страница (блоки preloader → hero → about → portfolio → contact → footer)
- `src/components/` — блоки, секции/сцены сайта
- `src/pages/PortfolioWorksPage.tsx` — страница `/portfolio`
- `src/data/worksProjects.ts` — данные карточек работ

## Примечания

- Фавикон: `icons/favicon.svg` (подключён в `index.html`)
- Сборка: результат лежит в папке `dist/`

## Брендбук
- [brand_book_v1.0.pdf](brand_book/brand_book_v1.0.pdf)
