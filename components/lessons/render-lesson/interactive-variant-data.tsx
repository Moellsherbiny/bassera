"use client";

import { useState } from "react";
import type { InteractiveVariantDataProps, LessonContentVariant, MatchingData, MatchingPair } from "@/types/lessons";
import { MatchingGame } from "./matching-game";



export function InteractiveVariantData({
  type,
  data,
}: InteractiveVariantDataProps) {
  if (!data || typeof data !== "object") {
    return (
      <p className="text-sm text-default-400">
        لا يوجد محتوى تفاعلي متاح.
      </p>
    );
  }

  switch (type) {
    case "MATCHING":
      return <MatchingRenderer data={data} />;

    case "MULTIPLE_CHOICE":
      return (
        <p className="text-sm text-default-400">
          نشاط الاختيار من متعدد غير متاح حاليًا.
        </p>
      );

    case "TRUE_FALSE":
      return (
        <p className="text-sm text-default-400">
          نشاط صح وخطأ غير متاح حاليًا.
        </p>
      );

    case "DRAG_DROP":
      return (
        <p className="text-sm text-default-400">
          نشاط السحب والإفلات غير متاح حاليًا.
        </p>
      );

    case "ORDERING":
      return (
        <p className="text-sm text-default-400">
          نشاط الترتيب غير متاح حاليًا.
        </p>
      );

    case "FLASHCARDS":
      return (
        <p className="text-sm text-default-400">
          البطاقات التعليمية غير متاحة حاليًا.
        </p>
      );

    case "HOTSPOT":
      return (
        <p className="text-sm text-default-400">
          نشاط تحديد النقاط غير متاح حاليًا.
        </p>
      );

    case "SIMULATION":
      return (
        <p className="text-sm text-default-400">
          المحاكاة غير متاحة حاليًا.
        </p>
      );

    default:
      return (
        <p className="text-sm text-default-400">
          نوع النشاط التفاعلي غير مدعوم.
        </p>
      );
  }
}

/* -------------------------------------------------------------------------- */
/* Matching                                                                   */
/* -------------------------------------------------------------------------- */

function MatchingRenderer({ data }: { data: unknown }) {
  const object = data as Partial<MatchingData>;

  const pairs = Array.isArray(object.pairs)
    ? object.pairs.filter(
        (pair): pair is MatchingPair =>
          typeof pair === "object" &&
          pair !== null &&
          typeof pair.id === "string" &&
          typeof pair.left === "string" &&
          typeof pair.right === "string",
      )
    : [];

  if (pairs.length === 0) {
    return (
      <p className="text-sm text-default-400">
        لا توجد عناصر مطابقة متاحة.
      </p>
    );
  }

  return <MatchingGame pairs={pairs} data={object} />;
}