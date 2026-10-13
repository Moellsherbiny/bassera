"use client";

import { Layers } from "@gravity-ui/icons";

type HierarchyItem = {
  title: string;
  description: string;
  systems?: string[];
};

type HierarchySection = {
  title: string;
  items: HierarchyItem[];
};

export type HierarchyInfographicData = {
  intro: string;
  style: "HierarchyInfographic";
  title: string;
  summary: string;
  sections: HierarchySection[];
};

type HierarchyInfographicProps = {
  data: HierarchyInfographicData;
};

/* Each section gets its own color, so the reader can tell branches apart
   at a glance. Full class names are written out so Tailwind can detect them. */
const PALETTE = [
  {
    solid: "bg-violet-600 text-white",
    soft: "bg-violet-50 dark:bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-300",
    line: "bg-violet-200 dark:bg-violet-500/30",
    accent: "border-s-violet-500",
    dot: "bg-violet-500",
  },
  {
    solid: "bg-sky-600 text-white",
    soft: "bg-sky-50 dark:bg-sky-500/10",
    text: "text-sky-700 dark:text-sky-300",
    line: "bg-sky-200 dark:bg-sky-500/30",
    accent: "border-s-sky-500",
    dot: "bg-sky-500",
  },
  {
    solid: "bg-emerald-600 text-white",
    soft: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-300",
    line: "bg-emerald-200 dark:bg-emerald-500/30",
    accent: "border-s-emerald-500",
    dot: "bg-emerald-500",
  },
  {
    solid: "bg-amber-500 text-white",
    soft: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-300",
    line: "bg-amber-200 dark:bg-amber-500/30",
    accent: "border-s-amber-500",
    dot: "bg-amber-500",
  },
  {
    solid: "bg-rose-600 text-white",
    soft: "bg-rose-50 dark:bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-300",
    line: "bg-rose-200 dark:bg-rose-500/30",
    accent: "border-s-rose-500",
    dot: "bg-rose-500",
  },
  {
    solid: "bg-teal-600 text-white",
    soft: "bg-teal-50 dark:bg-teal-500/10",
    text: "text-teal-700 dark:text-teal-300",
    line: "bg-teal-200 dark:bg-teal-500/30",
    accent: "border-s-teal-500",
    dot: "bg-teal-500",
  },
];

type Tone = (typeof PALETTE)[number];

const toneAt = (index: number): Tone => PALETTE[index % PALETTE.length];

const countLabel = (n: number) => (n === 1 ? "عنصر واحد" : `${n} عناصر`);

export default function HierarchyInfographic({
  data,
}: HierarchyInfographicProps) {
  const sections = data.sections ?? [];

  return (
    <section
      dir="rtl"
      className="w-full overflow-hidden rounded-3xl border border-default-200 bg-background shadow-sm"
    >
      {/* Color strip: one segment per section, previews the palette below */}
      <div className="flex h-1.5 w-full" aria-hidden="true">
        {sections.map((_, i) => (
          <div key={i} className={`flex-1 ${toneAt(i).dot}`} />
        ))}
      </div>

      {/* ---------- Header ---------- */}
      <header className="mx-auto max-w-5xl px-5 pb-6 pt-8 sm:px-8 sm:pt-10">
        <h2 className="text-2xl font-bold leading-snug text-foreground sm:text-3xl">
          {data.title}
        </h2>

        {data.intro && (
          <p className="mt-4 max-w-3xl text-sm leading-8 text-foreground/70 sm:text-base sm:leading-9">
            {data.intro}
          </p>
        )}

        {data.summary && (
          <p className="mt-5 rounded-2xl bg-default-100 px-5 py-4 text-sm leading-7 text-foreground/80 sm:text-base sm:leading-8">
            {data.summary}
          </p>
        )}

        {/* Quick map: jump to any section */}
        {sections.length > 1 && (
          <nav
            aria-label="أقسام الهيكل"
            className="mt-6 flex flex-wrap gap-2"
          >
            {sections.map((section, i) => {
              const tone = toneAt(i);
              return (
                <a
                  key={`${section.title}-${i}`}
                  href={`#hierarchy-section-${i}`}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-focus sm:text-sm ${tone.soft} ${tone.text}`}
                >
                  <span className={`size-2 rounded-full ${tone.dot}`} />
                  {section.title}
                </a>
              );
            })}
          </nav>
        )}
      </header>

      {/* ---------- Tree ---------- */}
      <div className="mx-auto max-w-5xl px-5 pb-10 sm:px-8">
        {/* Root */}
        <div className="grid grid-cols-[2.75rem_1fr] gap-x-4">
          <div className="flex flex-col items-center">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-foreground text-background">
              <Layers className="size-5" />
            </div>
            <div className="w-0.5 flex-1 bg-default-200" />
          </div>

          <div className="pb-6 pt-2.5">
            <h3 className="text-lg font-bold text-foreground sm:text-xl">
              {data.title}
            </h3>
            <p className="mt-0.5 text-xs text-foreground/50">
              {sections.length === 1 ? "قسم واحد" : `${sections.length} أقسام`}
            </p>
          </div>
        </div>

        {/* Sections */}
        {sections.map((section, i) => (
          <SectionBlock
            key={`${section.title}-${i}`}
            section={section}
            index={i}
            tone={toneAt(i)}
            isLast={i === sections.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

/* =============================================================
   SECTION  (level 2)
============================================================= */

function SectionBlock({
  section,
  index,
  tone,
  isLast,
}: {
  section: HierarchySection;
  index: number;
  tone: Tone;
  isLast: boolean;
}) {
  return (
    <div
      id={`hierarchy-section-${index}`}
      className="grid scroll-mt-6 grid-cols-[2.75rem_1fr] gap-x-4"
    >
      {/* Spine: node + line down to the next section */}
      <div className="flex flex-col items-center">
        <div
          className={`flex size-11 items-center justify-center rounded-2xl text-base font-bold shadow-sm ${tone.solid}`}
        >
          {index + 1}
        </div>
        {!isLast && <div className={`w-0.5 flex-1 ${tone.line}`} />}
      </div>

      <div className={isLast ? "pb-0" : "pb-10"}>
        {/* Section title */}
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 pt-2">
          <h3 className={`text-lg font-bold sm:text-xl ${tone.text}`}>
            {section.title}
          </h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tone.soft} ${tone.text}`}
          >
            {countLabel(section.items.length)}
          </span>
        </div>

        {/* Items */}
        <div className="grid gap-3 md:grid-cols-2">
          {section.items.map((item, i) => (
            <ItemCard key={`${item.title}-${i}`} item={item} tone={tone} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   ITEM  (level 3)
============================================================= */

function ItemCard({ item, tone }: { item: HierarchyItem; tone: Tone }) {
  const hasSystems = item.systems && item.systems.length > 0;

  return (
    <article
      className={`flex flex-col rounded-2xl border border-s-4 border-default-200 bg-content1 p-4 ${tone.accent}`}
    >
      <h4 className="text-sm font-bold leading-6 text-foreground sm:text-base">
        {item.title}
      </h4>

      {item.description && (
        <p className="mt-2 text-sm leading-7 text-foreground/65">
          {item.description}
        </p>
      )}

      {hasSystems && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {item.systems!.map((system, i) => (
            <li
              key={`${system}-${i}`}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${tone.soft} ${tone.text}`}
            >
              <span className={`size-1.5 rounded-full ${tone.dot}`} />
              {system}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}