
"use client";

import { CircleCheck } from "@gravity-ui/icons";

type StepsItem = {
  title: string;
  description: string;
};

type StepsSection = {
  title: string;
  items: StepsItem[];
};

export type StepsInfographicData = {
  intro: string;
  style: "StepsInfographic";
  title: string;
  summary: string;
  sections: StepsSection[];
};

type StepsInfographicProps = {
  data: StepsInfographicData;
};

/* =============================================================
   PALETTE
============================================================= */

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

const stepsLabel = (n: number) => {
  if (n === 1) return "خطوة واحدة";
  if (n === 2) return "خطوتان";
  if (n <= 10) return `${n} خطوات`;
  return `${n} خطوة`;
};

/* =============================================================
   MAIN
============================================================= */

export default function StepsInfographic({
  data,
}: StepsInfographicProps) {
  const sections = data.sections ?? [];

  return (
    <section
      dir="rtl"
      className="w-full overflow-hidden rounded-2xl border border-default-200 bg-background shadow-sm sm:rounded-3xl"
    >
      {/* =====================================================
          Color Strip
      ====================================================== */}

      <div
        className="flex h-1 w-full sm:h-1.5"
        aria-hidden="true"
      >
        {sections.map((_, i) => (
          <div
            key={i}
            className={`min-w-0 flex-1 ${toneAt(i).dot}`}
          />
        ))}
      </div>

      <div className="mx-auto w-full max-w-4xl px-3.5 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
        {/* ===================================================
            Header
        ==================================================== */}

        <header className="min-w-0">
          <h2 className="break-words text-xl font-bold leading-8 text-foreground sm:text-2xl sm:leading-9 md:text-3xl md:leading-tight">
            {data.title}
          </h2>

          {data.intro && (
            <p className="mt-3 max-w-3xl break-words text-sm leading-7 text-foreground/70 sm:mt-4 sm:text-base sm:leading-8 md:leading-9">
              {data.intro}
            </p>
          )}

          {/* Summary */}
          {data.summary && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-primary/10 p-3.5 sm:mt-6 sm:gap-3 sm:rounded-2xl sm:p-5">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary sm:mt-1 sm:size-5" />

              <div className="min-w-0">
                <p className="text-xs font-bold text-primary sm:text-sm">
                  الخلاصة
                </p>

                <p className="mt-1 text-xs leading-6 text-foreground/80 sm:text-sm sm:leading-7 md:text-base md:leading-8">
                  {data.summary}
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              Phase Navigation
          ================================================== */}

          {sections.length > 1 && (
            <nav
              aria-label="مراحل التنفيذ"
              className="mt-5 -mx-1 overflow-x-auto px-1 pb-1 scrollbar-thin sm:mt-6"
            >
              <div className="flex w-max min-w-full gap-2">
                {sections.map((section, i) => {
                  const tone = toneAt(i);

                  return (
                    <a
                      key={`${section.title}-${i}`}
                      href={`#steps-section-${i}`}
                      title={section.title}
                      className={`inline-flex max-w-[220px] shrink-0 items-center gap-1.5 rounded-full py-1.5 pe-3 ps-1.5 text-xs font-semibold outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-focus sm:max-w-[260px] sm:gap-2 sm:py-2 sm:pe-3.5 sm:ps-1.5 sm:text-sm ${tone.soft} ${tone.text}`}
                    >
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold sm:size-7 sm:text-xs ${tone.solid}`}
                      >
                        {i + 1}
                      </span>

                      <span className="truncate">
                        {section.title}
                      </span>
                    </a>
                  );
                })}
              </div>
            </nav>
          )}
        </header>

        {/* ===================================================
            Phases
        ==================================================== */}

        <div className="mt-7 space-y-4 sm:mt-8 sm:space-y-5 md:mt-10 md:space-y-6">
          {sections.map((section, i) => (
            <PhaseCard
              key={`${section.title}-${i}`}
              section={section}
              index={i}
              tone={toneAt(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   PHASE CARD
============================================================= */

function PhaseCard({
  section,
  index,
  tone,
}: {
  section: StepsSection;
  index: number;
  tone: Tone;
}) {
  return (
    <section
      id={`steps-section-${index}`}
      className={`scroll-mt-4 overflow-hidden rounded-xl border bg-content1 sm:scroll-mt-6 sm:rounded-2xl ${tone.border}`}
    >
      {/* Phase Header */}
      <div
        className={`flex items-center gap-2.5 px-3.5 py-3 sm:gap-3 sm:px-5 sm:py-4 md:px-6 ${tone.soft}`}
      >
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold sm:size-10 sm:rounded-xl sm:text-base ${tone.solid}`}
        >
          {index + 1}
        </span>

        <div className="min-w-0 flex-1">
          <h3
            className={`break-words text-sm font-bold leading-6 sm:text-lg sm:leading-7 md:text-xl ${tone.text}`}
          >
            {section.title}
          </h3>

          <p className="mt-0.5 text-[11px] text-foreground/50 sm:text-xs">
            {stepsLabel(section.items.length)}
          </p>
        </div>
      </div>

      {/* Steps */}
      <ol className="px-3.5 py-5 sm:px-5 sm:py-6 md:px-6">
        {section.items.map((item, i) => (
          <StepRow
            key={`${item.title}-${i}`}
            item={item}
            index={i}
            tone={tone}
            isLast={i === section.items.length - 1}
          />
        ))}
      </ol>
    </section>
  );
}

/* =============================================================
   STEP ROW
============================================================= */

function StepRow({
  item,
  index,
  tone,
  isLast,
}: {
  item: StepsItem;
  index: number;
  tone: Tone;
  isLast: boolean;
}) {
  return (
    <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[2.25rem_minmax(0,1fr)] sm:gap-x-4">
      {/* Node + Line */}
      <div className="flex flex-col items-center">
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:size-9 sm:text-sm ${tone.solid}`}
        >
          {index + 1}
        </span>

        {!isLast && (
          <span
            className={`my-1 min-h-5 w-0.5 flex-1 ${tone.line}`}
          />
        )}
      </div>

      {/* Content */}
      <div
        className={
          isLast
            ? "min-w-0 pt-0.5"
            : "min-w-0 pb-5 pt-0.5 sm:pb-6"
        }
      >
        <h4 className="break-words text-sm font-bold leading-6 text-foreground sm:text-base sm:leading-7 md:text-lg">
          {item.title}
        </h4>

        {item.description && (
          <p className="mt-1.5 break-words text-xs leading-6 text-foreground/65 sm:text-sm sm:leading-7 md:text-base md:leading-8">
            {item.description}
          </p>
        )}
      </div>
    </li>
  );
}
