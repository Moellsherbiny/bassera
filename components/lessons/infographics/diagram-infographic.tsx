"use client";

import { CircleCheck, Layers } from "@gravity-ui/icons";

type DiagramItem = {
  title: string;
  description: string;
  systems?: string[];
};

type DiagramSection = {
  title: string;
  items: DiagramItem[];
};

export type DiagramInfographicData = {
  intro: string;
  style: "DiagramInfographic";
  title: string;
  summary: string;
  sections: DiagramSection[];
};

type DiagramInfographicProps = {
  data: DiagramInfographicData;
};

/* One color per branch. Full class names are written out so Tailwind
   can detect them. Edit this list to match your brand. */
const PALETTE = [
  {
    solid: "bg-violet-600 text-white",
    soft: "bg-violet-50 dark:bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-300",
    line: "bg-violet-300 dark:bg-violet-500/40",
    border: "border-violet-200 dark:border-violet-500/30",
    dot: "bg-violet-500",
  },
  {
    solid: "bg-sky-600 text-white",
    soft: "bg-sky-50 dark:bg-sky-500/10",
    text: "text-sky-700 dark:text-sky-300",
    line: "bg-sky-300 dark:bg-sky-500/40",
    border: "border-sky-200 dark:border-sky-500/30",
    dot: "bg-sky-500",
  },
  {
    solid: "bg-emerald-600 text-white",
    soft: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-300",
    line: "bg-emerald-300 dark:bg-emerald-500/40",
    border: "border-emerald-200 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  {
    solid: "bg-amber-500 text-white",
    soft: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-300",
    line: "bg-amber-300 dark:bg-amber-500/40",
    border: "border-amber-200 dark:border-amber-500/30",
    dot: "bg-amber-500",
  },
  {
    solid: "bg-rose-600 text-white",
    soft: "bg-rose-50 dark:bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-300",
    line: "bg-rose-300 dark:bg-rose-500/40",
    border: "border-rose-200 dark:border-rose-500/30",
    dot: "bg-rose-500",
  },
  {
    solid: "bg-teal-600 text-white",
    soft: "bg-teal-50 dark:bg-teal-500/10",
    text: "text-teal-700 dark:text-teal-300",
    line: "bg-teal-300 dark:bg-teal-500/40",
    border: "border-teal-200 dark:border-teal-500/30",
    dot: "bg-teal-500",
  },
];

type Tone = (typeof PALETTE)[number];

const toneAt = (i: number): Tone => PALETTE[i % PALETTE.length];

/* Up to 4 branches are drawn as a tree on wide screens.
   With more branches the connectors are dropped and cards form a plain grid. */
const TREE_COLS = ["", "lg:grid-cols-1", "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4"];

export default function DiagramInfographic({
  data,
}: DiagramInfographicProps) {
  /* The first section holds the main branches.
     The remaining sections hold the details. */
  const mainSection = data.sections?.[0];
  const detailSections = data.sections?.slice(1) ?? [];
  const branches = mainSection?.items ?? [];
  const isTree = branches.length >= 1 && branches.length <= 4;

  return (
    <section
      dir="rtl"
      className="w-full overflow-hidden rounded-3xl border border-default-200 bg-background shadow-sm"
    >
      {/* Color strip: one segment per branch */}
      <div className="flex h-1.5 w-full" aria-hidden="true">
        {branches.map((_, i) => (
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

        {/* ---------- Diagram ---------- */}
        {mainSection && (
          <div className="mt-10">
            {/* Center node */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-sm rounded-3xl bg-foreground px-6 py-5 text-center text-background shadow-sm">
                <Layers className="mx-auto mb-2 size-6" />
                <h3 className="text-lg font-bold leading-7 sm:text-xl">
                  {data.title}
                </h3>
                {mainSection.title && (
                  <p className="mt-1 text-xs opacity-70">
                    {mainSection.title}
                  </p>
                )}
              </div>
              <div
                className="hidden h-6 w-0.5 bg-default-300 lg:block"
                aria-hidden="true"
              />
            </div>

            {/* Branches */}
            <div
              className={`mt-6 grid gap-4 sm:grid-cols-2 lg:mt-0 ${
                isTree ? `lg:gap-0 ${TREE_COLS[branches.length]}` : "lg:grid-cols-3"
              }`}
            >
              {branches.map((item, i) => (
                <Branch
                  key={`${item.title}-${i}`}
                  item={item}
                  index={i}
                  tone={toneAt(i)}
                  isTree={isTree}
                  isFirst={i === 0}
                  isLast={i === branches.length - 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* ---------- Details ---------- */}
        {detailSections.length > 0 && (
          <div className="mt-12 space-y-6">
            <h3 className="text-lg font-bold text-foreground sm:text-xl">
              تفاصيل المجالات
            </h3>

            {detailSections.map((section, i) => (
              <DetailSection
                key={`${section.title}-${i}`}
                section={section}
                tone={toneAt(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* =============================================================
   BRANCH  (main section items)
============================================================= */

function Branch({
  item,
  index,
  tone,
  isTree,
  isFirst,
  isLast,
}: {
  item: DiagramItem;
  index: number;
  tone: Tone;
  isTree: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const hasSystems = item.systems && item.systems.length > 0;

  /* Horizontal bar joins each branch to its neighbours.
     The first branch only reaches inward, the last only reaches inward. */
  const bar = isFirst && isLast ? "" : isFirst ? "start-1/2 end-0" : isLast ? "start-0 end-1/2" : "start-0 end-0";

  return (
    <article className={`relative ${isTree ? "lg:px-2 lg:pt-6" : ""}`}>
      {isTree && (
        <>
          {bar && (
            <span
              className={`absolute top-0 hidden h-0.5 lg:block ${bar} ${tone.line}`}
              aria-hidden="true"
            />
          )}
          <span
            className={`absolute left-1/2 top-0 hidden h-6 w-0.5 -translate-x-1/2 lg:block ${tone.line}`}
            aria-hidden="true"
          />
        </>
      )}

      <div
        className={`h-full overflow-hidden rounded-2xl border bg-content1 ${tone.border}`}
      >
        <div className={`flex items-center gap-3 px-4 py-3.5 ${tone.soft}`}>
          <span
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${tone.solid}`}
          >
            {index + 1}
          </span>
          <h4 className={`text-base font-bold leading-6 ${tone.text}`}>
            {item.title}
          </h4>
        </div>

        <div className="p-4">
          {item.description && (
            <p className="text-sm leading-7 text-foreground/65">
              {item.description}
            </p>
          )}

          {hasSystems && (
            <Systems systems={item.systems!} tone={tone} className="mt-4" />
          )}
        </div>
      </div>
    </article>
  );
}

/* =============================================================
   DETAIL SECTION
============================================================= */

function DetailSection({
  section,
  tone,
}: {
  section: DiagramSection;
  tone: Tone;
}) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border bg-content1 ${tone.border}`}
    >
      <div className={`flex items-center gap-3 px-5 py-4 sm:px-6 ${tone.soft}`}>
        <span
          className={`size-3 shrink-0 rounded-full ${tone.dot}`}
          aria-hidden="true"
        />
        <h4 className={`text-base font-bold sm:text-lg ${tone.text}`}>
          {section.title}
        </h4>
      </div>

      <ul className="grid divide-y divide-default-100 sm:grid-cols-2 sm:divide-y-0">
        {section.items.map((item, i) => (
          <li
            key={`${item.title}-${i}`}
            className="p-5 sm:border-b sm:border-default-100 sm:p-6 sm:odd:border-e"
          >
            <h5 className="text-base font-bold leading-7 text-foreground">
              {item.title}
            </h5>

            {item.description && (
              <p className="mt-1.5 text-sm leading-7 text-foreground/65">
                {item.description}
              </p>
            )}

            {item.systems && item.systems.length > 0 && (
              <Systems systems={item.systems} tone={tone} className="mt-3" />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* =============================================================
   SYSTEMS (chips)
============================================================= */

function Systems({
  systems,
  tone,
  className = "",
}: {
  systems: string[];
  tone: Tone;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground/50">
        <Layers className="size-3.5" />
        <span>النظم التابعة</span>
      </div>

      <ul className="flex flex-wrap gap-2">
        {systems.map((system, i) => (
          <li
            key={`${system}-${i}`}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium ${tone.soft} ${tone.text}`}
          >
            {system}
          </li>
        ))}
      </ul>
    </div>
  );
}