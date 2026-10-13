"use client";

import { CircleCheck } from "@gravity-ui/icons";

type ProcessItem = {
  title: string;
  description: string;
};

type ProcessSection = {
  title: string;
  items: ProcessItem[];
};

export type ProcessInfographicData = {
  intro: string;
  style: "ProcessInfographic";
  title: string;
  summary: string;
  sections: ProcessSection[];
};

type ProcessInfographicProps = {
  data: ProcessInfographicData;
};

/* One color per stage. Full class names are written out so Tailwind
   can detect them. Edit this list to match your brand. */
const PALETTE = [
  {
    solid: "bg-violet-600 text-white",
    soft: "bg-violet-50 dark:bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-300",
    line: "bg-violet-200 dark:bg-violet-500/30",
    border: "border-violet-200 dark:border-violet-500/30",
    dot: "bg-violet-500",
  },
  {
    solid: "bg-sky-600 text-white",
    soft: "bg-sky-50 dark:bg-sky-500/10",
    text: "text-sky-700 dark:text-sky-300",
    line: "bg-sky-200 dark:bg-sky-500/30",
    border: "border-sky-200 dark:border-sky-500/30",
    dot: "bg-sky-500",
  },
  {
    solid: "bg-emerald-600 text-white",
    soft: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-300",
    line: "bg-emerald-200 dark:bg-emerald-500/30",
    border: "border-emerald-200 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  {
    solid: "bg-amber-500 text-white",
    soft: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-300",
    line: "bg-amber-200 dark:bg-amber-500/30",
    border: "border-amber-200 dark:border-amber-500/30",
    dot: "bg-amber-500",
  },
  {
    solid: "bg-rose-600 text-white",
    soft: "bg-rose-50 dark:bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-300",
    line: "bg-rose-200 dark:bg-rose-500/30",
    border: "border-rose-200 dark:border-rose-500/30",
    dot: "bg-rose-500",
  },
  {
    solid: "bg-teal-600 text-white",
    soft: "bg-teal-50 dark:bg-teal-500/10",
    text: "text-teal-700 dark:text-teal-300",
    line: "bg-teal-200 dark:bg-teal-500/30",
    border: "border-teal-200 dark:border-teal-500/30",
    dot: "bg-teal-500",
  },
];

type Tone = (typeof PALETTE)[number];

const toneAt = (i: number): Tone => PALETTE[i % PALETTE.length];

/* The flow runs horizontally on wide screens and vertically otherwise.
   Up to 4 stages switch to horizontal at `lg`; more stages wait for `xl`
   so the columns stay readable. Classes are written out in full for Tailwind. */
const LAYOUTS = {
  lg: {
    grid: [
      "",
      "lg:grid-cols-1",
      "lg:grid-cols-2",
      "lg:grid-cols-3",
      "lg:grid-cols-4",
    ],
    stage: "lg:flex-col lg:gap-4",
    rail: "lg:flex-row",
    line: "lg:mx-2 lg:my-0 lg:h-0.5 lg:w-auto",
    pad: "lg:pb-0",
  },
  xl: {
    grid: [
      "",
      "",
      "",
      "",
      "",
      "xl:grid-cols-5",
      "xl:grid-cols-6",
    ],
    stage: "xl:flex-col xl:gap-4",
    rail: "xl:flex-row",
    line: "xl:mx-2 xl:my-0 xl:h-0.5 xl:w-auto",
    pad: "xl:pb-0",
  },
};

const tasksLabel = (n: number) => {
  if (n === 1) return "وظيفة واحدة";
  if (n === 2) return "وظيفتان";
  if (n <= 10) return `${n} وظائف`;
  return `${n} وظيفة`;
};

export default function ProcessInfographic({
  data,
}: ProcessInfographicProps) {
  const sections = data.sections ?? [];
  const count = sections.length;
  const layout = count <= 4 ? LAYOUTS.lg : LAYOUTS.xl;
  const gridClass = layout.grid[Math.min(count, layout.grid.length - 1)];

  return (
    <section
      dir="rtl"
      className="w-full overflow-hidden rounded-3xl border border-default-200 bg-background shadow-sm"
    >
      {/* Color strip: one segment per stage */}
      <div className="flex h-1.5 w-full" aria-hidden="true">
        {sections.map((_, i) => (
          <div key={i} className={`flex-1 ${toneAt(i).dot}`} />
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        {/* ---------- Header ---------- */}
        <header className="max-w-4xl">
          <h2 className="text-2xl font-bold leading-snug text-foreground sm:text-3xl">
            {data.title}
          </h2>

          {data.intro && (
            <p className="mt-4 text-sm leading-8 text-foreground/70 sm:text-base sm:leading-9">
              {data.intro}
            </p>
          )}

          {data.summary && (
            <div className="mt-6 flex gap-3 rounded-2xl bg-primary/10 p-5">
              <CircleCheck className="mt-1 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-bold text-primary">الخلاصة</p>
                <p className="mt-1 text-sm leading-7 text-foreground/80 sm:text-base sm:leading-8">
                  {data.summary}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* ---------- Flow ---------- */}
        <ol className={`mt-10 grid gap-x-4 ${gridClass}`}>
          {sections.map((section, i) => (
            <Stage
              key={`${section.title}-${i}`}
              section={section}
              index={i}
              tone={toneAt(i)}
              isLast={i === count - 1}
              layout={layout}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

/* =============================================================
   STAGE
   Mobile: number + vertical line on the side, card beside it.
   Wide:   number + horizontal line on top, card below.
============================================================= */

function Stage({
  section,
  index,
  tone,
  isLast,
  layout,
}: {
  section: ProcessSection;
  index: number;
  tone: Tone;
  isLast: boolean;
  layout: (typeof LAYOUTS)[keyof typeof LAYOUTS];
}) {
  return (
    <li className={`flex gap-4 ${layout.stage}`}>
      {/* Rail */}
      <div className={`flex shrink-0 flex-col items-center ${layout.rail}`}>
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-2xl text-base font-bold shadow-sm ${tone.solid}`}
        >
          {index + 1}
        </span>

        {!isLast && (
          <span
            className={`my-1 w-0.5 flex-1 ${tone.line} ${layout.line}`}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Card */}
      <div
        className={`min-w-0 flex-1 ${
          isLast ? "" : `pb-6 ${layout.pad}`
        }`}
      >
        <div
          className={`overflow-hidden rounded-2xl border bg-content1 ${tone.border}`}
        >
          <div className={`px-4 py-3.5 ${tone.soft}`}>
            <h3 className={`text-base font-bold leading-6 ${tone.text}`}>
              {section.title}
            </h3>
            <p className="mt-0.5 text-xs text-foreground/50">
              {tasksLabel(section.items.length)}
            </p>
          </div>

          <ul className="divide-y divide-default-100">
            {section.items.map((item, i) => (
              <li key={`${item.title}-${i}`} className="flex gap-2.5 p-4">
                <span
                  className={`mt-2 size-1.5 shrink-0 rounded-full ${tone.dot}`}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold leading-6 text-foreground">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="mt-1 text-xs leading-6 text-foreground/60 sm:text-sm sm:leading-7">
                      {item.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}