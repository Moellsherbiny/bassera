"use client";

import { CircleCheck, Layers } from "@gravity-ui/icons";

type CardsItem = {
  title: string;
  description: string;
  systems?: string[];
};

type CardsSection = {
  title: string;
  items: CardsItem[];
};

export type CardsInfographicData = {
  intro: string;
  style: "CardsInfographic";
  title: string;
  summary: string;
  sections: CardsSection[];
};

type CardsInfographicProps = {
  data: CardsInfographicData;
};

/* One color per section. Full class names are written out so Tailwind
   can detect them. Edit this list to match your brand. */
const PALETTE = [
  {
    soft: "bg-violet-50 dark:bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-500/30",
    dot: "bg-violet-500",
  },
  {
    soft: "bg-sky-50 dark:bg-sky-500/10",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-500/30",
    dot: "bg-sky-500",
  },
  {
    soft: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  {
    soft: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-500/30",
    dot: "bg-amber-500",
  },
  {
    soft: "bg-rose-50 dark:bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-500/30",
    dot: "bg-rose-500",
  },
  {
    soft: "bg-teal-50 dark:bg-teal-500/10",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-500/30",
    dot: "bg-teal-500",
  },
];

type Tone = (typeof PALETTE)[number];

const toneAt = (i: number): Tone => PALETTE[i % PALETTE.length];

const countLabel = (n: number) => (n === 1 ? "عنصر واحد" : `${n} عناصر`);

export default function CardsInfographic({ data }: CardsInfographicProps) {
  const sections = data.sections ?? [];

  return (
    <section
      dir="rtl"
      className="w-full overflow-hidden rounded-3xl border border-default-200 bg-background shadow-sm"
    >
      {/* Color strip: one segment per section */}
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

          {/* Section chips: jump to any section */}
          {sections.length > 1 && (
            <nav
              aria-label="أقسام البطاقات"
              className="mt-6 flex flex-wrap gap-2"
            >
              {sections.map((section, i) => {
                const tone = toneAt(i);
                return (
                  <a
                    key={`${section.title}-${i}`}
                    href={`#cards-section-${i}`}
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-focus sm:text-sm ${tone.soft} ${tone.text}`}
                  >
                    <span className={`size-2 rounded-full ${tone.dot}`} />
                    {section.title}
                  </a>
                );
              })}
            </nav>
          )}
        </header>

        {/* ---------- Sections ---------- */}
        <div className="mt-10 space-y-10">
          {sections.map((section, i) => (
            <SectionBlock
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
   SECTION
============================================================= */

function SectionBlock({
  section,
  index,
  tone,
}: {
  section: CardsSection;
  index: number;
  tone: Tone;
}) {
  return (
    <section id={`cards-section-${index}`} className="scroll-mt-6">
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span
          className={`size-3 shrink-0 rounded-full ${tone.dot}`}
          aria-hidden="true"
        />
        <h3 className="text-lg font-bold text-foreground sm:text-xl">
          {section.title}
        </h3>
        <span className="text-xs text-foreground/50">
          {countLabel(section.items.length)}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item, i) => (
          <InfoCard key={`${item.title}-${i}`} item={item} tone={tone} />
        ))}
      </div>
    </section>
  );
}

/* =============================================================
   CARD
============================================================= */

function InfoCard({ item, tone }: { item: CardsItem; tone: Tone }) {
  const hasSystems = item.systems && item.systems.length > 0;

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border p-5 ${tone.soft} ${tone.border}`}
    >
      <h4 className={`text-base font-bold leading-7 ${tone.text}`}>
        {item.title}
      </h4>

      {item.description && (
        <p className="mt-2 text-sm leading-7 text-foreground/70">
          {item.description}
        </p>
      )}

      {hasSystems && (
        <div className="mt-auto pt-4">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground/50">
            <Layers className="size-3.5" />
            <span>العناصر المرتبطة</span>
          </div>

          <ul className="flex flex-wrap gap-2">
            {item.systems!.map((system, i) => (
              <li
                key={`${system}-${i}`}
                className="rounded-lg bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground/70"
              >
                {system}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}