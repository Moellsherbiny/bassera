"use client";

import { CircleCheck } from "@gravity-ui/icons";

type ComparisonItem = {
  title: string;
  description: string;
  systems?: string[];
};

type ComparisonSection = {
  title: string;
  items: ComparisonItem[];
};

export type ComparisonInfographicData = {
  intro: string;
  style: "ComparisonInfographic";
  title: string;
  summary: string;
  sections: ComparisonSection[];
};

type ComparisonInfographicProps = {
  data: ComparisonInfographicData;
};

/* Full class names are written out so Tailwind can detect them.
   Edit these to match your brand. */
const TONES = {
  violet: {
    solid: "bg-violet-600 text-white",
    soft: "bg-violet-50 dark:bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-500/30",
    dot: "bg-violet-500",
  },
  amber: {
    solid: "bg-amber-500 text-white",
    soft: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-500/30",
    dot: "bg-amber-500",
  },
  sky: {
    solid: "bg-sky-600 text-white",
    soft: "bg-sky-50 dark:bg-sky-500/10",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-500/30",
    dot: "bg-sky-500",
  },
  emerald: {
    solid: "bg-emerald-600 text-white",
    soft: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  teal: {
    solid: "bg-teal-600 text-white",
    soft: "bg-teal-50 dark:bg-teal-500/10",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-500/30",
    dot: "bg-teal-500",
  },
  rose: {
    solid: "bg-rose-600 text-white",
    soft: "bg-rose-50 dark:bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-500/30",
    dot: "bg-rose-500",
  },
};

type Tone = (typeof TONES)[keyof typeof TONES];

/* The two compared sides always keep the same two contrasting colors.
   Detail sections use the other colors, so they never look like a side. */
const SIDE_TONES: Tone[] = [TONES.violet, TONES.amber];
const DETAIL_TONES: Tone[] = [TONES.sky, TONES.emerald, TONES.teal, TONES.rose];

export default function ComparisonInfographic({
  data,
}: ComparisonInfographicProps) {
  const mainSection = data.sections?.[0];
  const sides = (mainSection?.items ?? []).slice(0, 2);
  const detailSections = data.sections?.slice(1) ?? [];

  return (
    <section
      dir="rtl"
      className="w-full overflow-hidden rounded-3xl border border-default-200 bg-background shadow-sm"
    >
      {/* Color strip: the two sides */}
      <div className="flex h-1.5 w-full" aria-hidden="true">
        {sides.map((_, i) => (
          <div key={i} className={`flex-1 ${SIDE_TONES[i].dot}`} />
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

        {/* ---------- The two sides ---------- */}
        {sides.length > 0 && (
          <div className="mt-10">
            {mainSection?.title && (
              <h3 className="mb-4 text-lg font-bold text-foreground sm:text-xl">
                {mainSection.title}
              </h3>
            )}

            <div
              className={`grid gap-4 ${
                sides.length === 2 ? "lg:grid-cols-[1fr_auto_1fr]" : ""
              }`}
            >
              <Side item={sides[0]} tone={SIDE_TONES[0]} />

              {sides.length === 2 && (
                <>
                  <div className="flex items-center justify-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background shadow-sm">
                      VS
                    </span>
                  </div>

                  <Side item={sides[1]} tone={SIDE_TONES[1]} />
                </>
              )}
            </div>
          </div>
        )}

        {/* ---------- Detail sections ---------- */}
        {detailSections.length > 0 && (
          <div className="mt-12 space-y-6">
            <h3 className="text-lg font-bold text-foreground sm:text-xl">
              تفاصيل المقارنة
            </h3>

            {detailSections.map((section, i) => (
              <DetailSection
                key={`${section.title}-${i}`}
                section={section}
                tone={DETAIL_TONES[i % DETAIL_TONES.length]}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* =============================================================
   SIDE
============================================================= */

function Side({ item, tone }: { item: ComparisonItem; tone: Tone }) {
  const hasSystems = item.systems && item.systems.length > 0;

  return (
    <article
      className={`overflow-hidden rounded-3xl border bg-content1 ${tone.border}`}
    >
      <div className={`px-5 py-4 sm:px-6 ${tone.solid}`}>
        <h4 className="text-lg font-bold leading-7 sm:text-xl">
          {item.title}
        </h4>
      </div>

      <div className="p-5 sm:p-6">
        {item.description && (
          <p className="text-sm leading-7 text-foreground/70 sm:text-base sm:leading-8">
            {item.description}
          </p>
        )}

        {hasSystems && (
          <ul className={`flex flex-wrap gap-2 ${item.description ? "mt-5" : ""}`}>
            {item.systems!.map((system, i) => (
              <li
                key={`${system}-${i}`}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium sm:text-sm ${tone.soft} ${tone.text}`}
              >
                {system}
              </li>
            ))}
          </ul>
        )}
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
  section: ComparisonSection;
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

      <ul className="divide-y divide-default-100">
        {section.items.map((item, i) => (
          <li
            key={`${item.title}-${i}`}
            className="grid gap-2 p-5 sm:grid-cols-[13rem_1fr] sm:gap-6 sm:p-6"
          >
            <h5 className="text-sm font-bold leading-7 text-foreground sm:text-base">
              {item.title}
            </h5>

            <div className="min-w-0">
              {item.description && (
                <p className="text-sm leading-7 text-foreground/65">
                  {item.description}
                </p>
              )}

              {item.systems && item.systems.length > 0 && (
                <ul
                  className={`flex flex-wrap gap-2 ${item.description ? "mt-3" : ""}`}
                >
                  {item.systems.map((system, j) => (
                    <li
                      key={`${system}-${j}`}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium ${tone.soft} ${tone.text}`}
                    >
                      {system}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}