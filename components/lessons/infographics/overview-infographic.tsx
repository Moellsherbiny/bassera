"use client";

import { CircleCheck, Layers } from "@gravity-ui/icons";
import { useEffect, useRef, useState } from "react";
type OverviewItem = {
  title: string;
  description: string;
  systems?: string[];
};

type OverviewSection = {
  title: string;
  items: OverviewItem[];
};

export type OverviewInfographicData = {
  title: string;
  intro: string;
  summary: string;
  sections: OverviewSection[];
};

type OverviewInfographicProps = {
  data: OverviewInfographicData;
};

/* =============================================================
   PALETTE
============================================================= */

const PALETTE = [
  {
    solid: "bg-violet-600 text-white",
    soft: "bg-violet-50 dark:bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-500/30",
    dot: "bg-violet-500",
  },
  {
    solid: "bg-sky-600 text-white",
    soft: "bg-sky-50 dark:bg-sky-500/10",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-500/30",
    dot: "bg-sky-500",
  },
  {
    solid: "bg-emerald-600 text-white",
    soft: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  {
    solid: "bg-amber-500 text-white",
    soft: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-500/30",
    dot: "bg-amber-500",
  },
  {
    solid: "bg-rose-600 text-white",
    soft: "bg-rose-50 dark:bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-500/30",
    dot: "bg-rose-500",
  },
  {
    solid: "bg-teal-600 text-white",
    soft: "bg-teal-50 dark:bg-teal-500/10",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-500/30",
    dot: "bg-teal-500",
  },
];

type Tone = (typeof PALETTE)[number];

const toneAt = (i: number): Tone => PALETTE[i % PALETTE.length];

/* =============================================================
   HELPERS
============================================================= */

const pointsLabel = (n: number) => {
  if (n === 1) return "نقطة واحدة";
  if (n === 2) return "نقطتان";
  if (n <= 10) return `${n} نقاط`;
  return `${n} نقطة`;
};

/* =============================================================
   MAIN
============================================================= */

export default function OverviewInfographic({
  data,
}: OverviewInfographicProps) {
  const sections = data.sections ?? [];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

useEffect(() => {
  const element = scrollRef.current;

  if (!element) return;

  const handleScroll = () => {
    setShowScrollHint(false);
  };

  element.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  return () => {
    element.removeEventListener("scroll", handleScroll);
  };
}, []);
  return (
    <section
      dir="rtl"
      className="w-full overflow-hidden rounded-2xl border border-default-200 bg-background shadow-sm sm:rounded-3xl"
    >
      {/* =====================================================
          Color Strip
      ====================================================== */}

      <div className="flex h-1 w-full sm:h-1.5" aria-hidden="true">
        {sections.map((_, i) => (
          <div key={i} className={`min-w-0 flex-1 ${toneAt(i).dot}`} />
        ))}
      </div>

      <div className="mx-auto w-full max-w-5xl px-3.5 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
        {/* ===================================================
            Intro
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

                <p className="mt-1 break-words text-xs leading-6 text-foreground/80 sm:text-sm sm:leading-7 md:text-base md:leading-8">
                  {data.summary}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* ===================================================
            At a Glance / Section Navigation
        ==================================================== */}

        {sections.length > 1 && (
          <nav
            aria-label="أقسام الصفحة"
            className="relative mt-6 sm:mt-7 md:mt-8"
          >
            {" "}
            <div
              ref={scrollRef}
              className=" overview-scroll -mx-1 overflow-x-auto px-1 pb-2 md:mx-0 md:overflow-visible md:px-0 md:pb-0 "
            >
              {" "}
              <div className=" flex w-max gap-2.5 md:w-auto md:flex-wrap md:gap-3 ">
                {" "}
                {sections.map((section, i) => {
                  const tone = toneAt(i);
                  return (
                    <a
                      key={`${section.title}-${i}`}
                      href={`#overview-section-${i}`}
                      title={section.title}
                      className={` flex w-[210px] shrink-0 items-center gap-2.5 rounded-xl border p-2.5 outline-none transition-all hover:shadow-sm focus-visible:ring-2 focus-visible:ring-focus sm:w-[240px] md:w-auto md:min-w-[200px] md:max-w-[280px] md:shrink ${tone.soft} ${tone.border} `}
                    >
                      {" "}
                      <span
                        className={` flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white sm:size-9 sm:text-sm ${tone.solid} `}
                      >
                        {" "}
                        {i + 1}{" "}
                      </span>{" "}
                      <span className="min-w-0 flex-1">
                        {" "}
                        <span
                          className={` block truncate text-xs font-bold sm:text-sm ${tone.text} `}
                        >
                          {" "}
                          {section.title}{" "}
                        </span>{" "}
                        <span className="mt-0.5 block text-[11px] text-foreground/50 sm:text-xs">
                          {" "}
                          {pointsLabel(section.items.length)}{" "}
                        </span>{" "}
                      </span>{" "}
                    </a>
                  );
                })}{" "}
              </div>{" "}
            </div>{" "}
            {/* Mobile Scroll Hint */}{" "}
            <div
              className={`
    pointer-events-none
    absolute
    inset-y-0
    end-0
    flex
    items-center
    pe-0.5
    transition-all
    duration-300
    md:hidden
    ${
      showScrollHint
        ? "translate-x-0 opacity-100"
        : "translate-x-2 opacity-0"
    }
  `}
  aria-hidden="true"
            >
              {" "}
              <div className=" flex h-full w-16 items-center justify-end bg-gradient-to-l from-background via-background/90 to-transparent pe-1 ">
                {" "}
                <div className=" flex items-center gap-1 rounded-full border border-default-200 bg-background/90 px-2 py-1.5 text-[10px] font-medium text-default-500 shadow-sm backdrop-blur ">
                  {" "}
                  <span>اسحب</span>{" "}
                  <span className=" flex size-4 items-center justify-center rounded-full bg-default-100 ">
                    {" "}
                    ←{" "}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </nav>
        )}
        {/* ===================================================
            Sections
        ==================================================== */}

        <div className="mt-7 space-y-4 sm:mt-8 sm:space-y-5 md:mt-10 md:space-y-6">
          {sections.map((section, i) => (
            <SectionCard
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

function SectionCard({
  section,
  index,
  tone,
}: {
  section: OverviewSection;
  index: number;
  tone: Tone;
}) {
  return (
    <section
      id={`overview-section-${index}`}
      className={`scroll-mt-4 overflow-hidden rounded-xl border bg-content1 sm:scroll-mt-6 sm:rounded-2xl ${tone.border}`}
    >
      {/* Section Header */}
      <div
        className={`flex items-center gap-2.5 px-3.5 py-3 sm:gap-3 sm:px-5 sm:py-4 md:px-6 ${tone.soft}`}
      >
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold sm:size-10 sm:rounded-xl sm:text-base ${tone.solid}`}
        >
          {index + 1}
        </span>

        <h3
          className={`min-w-0 break-words text-sm font-bold leading-6 sm:text-lg sm:leading-7 md:text-xl ${tone.text}`}
        >
          {section.title}
        </h3>
      </div>

      {/* Items */}
      <ul className="divide-y divide-default-100">
        {section.items.map((item, i) => (
          <ItemRow key={`${item.title}-${i}`} item={item} tone={tone} />
        ))}
      </ul>
    </section>
  );
}

/* =============================================================
   ITEM
============================================================= */

function ItemRow({ item, tone }: { item: OverviewItem; tone: Tone }) {
  const hasSystems = item.systems && item.systems.length > 0;

  return (
    <li className="flex gap-2.5 px-3.5 py-4 sm:gap-3 sm:px-5 sm:py-5 md:px-6">
      {/* Dot */}
      <span
        className={`mt-2 size-1.5 shrink-0 rounded-full sm:mt-2.5 sm:size-2 ${tone.dot}`}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h4 className="break-words text-sm font-bold leading-6 text-foreground sm:text-base sm:leading-7 md:text-lg">
          {item.title}
        </h4>

        {item.description && (
          <p className="mt-1.5 break-words text-xs leading-6 text-foreground/65 sm:text-sm sm:leading-7 md:text-base md:leading-8">
            {item.description}
          </p>
        )}

        {/* Systems */}
        {hasSystems && (
          <div className="mt-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-foreground/50 sm:text-xs">
              <Layers className="size-3 shrink-0 sm:size-3.5" />

              <span>أمثلة / أنظمة</span>
            </div>

            <ul className="flex flex-wrap gap-1.5 sm:gap-2">
              {item.systems!.map((system, i) => (
                <li
                  key={`${system}-${i}`}
                  className={`max-w-full break-words rounded-lg px-2 py-1 text-[11px] font-medium leading-5 sm:px-2.5 sm:py-1.5 sm:text-xs ${tone.soft} ${tone.text}`}
                >
                  {system}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
}
