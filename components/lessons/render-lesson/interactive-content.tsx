"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CircleCheck,
  CircleXmark,
} from "@gravity-ui/icons";
import { Button, Card, Radio, RadioGroup } from "@heroui/react";

import type { LessonContentVariant } from "@/types/lessons";
import { Trophy } from "lucide-react";

type InteractiveContentProps = {
  variant: LessonContentVariant;
};

type MultipleChoiceData = {
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation?: string;
};

type TrueFalseData = {
  question: string;
  correctAnswer: boolean;
  explanation?: string;
};

type MatchingData = {
  title?: string;
  pairs: {
    id: string;
    left: string;
    right: string;
  }[];
};

type OrderingData = {
  question: string;
  items: {
    id: string;
    text: string;
    order: number;
  }[];
};

type DragDropData = {
  question: string;
  categories: {
    id: string;
    label: string;
  }[];
  items: {
    id: string;
    text: string;
    categoryId: string;
  }[];
};

type FlashcardsData = {
  cards: {
    id: string;
    front: string;
    back: string;
  }[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(
  value: unknown,
  key: string,
): string | undefined {
  if (!isRecord(value)) return undefined;

  const result = value[key];

  return typeof result === "string" ? result : undefined;
}

function getBoolean(
  value: unknown,
  key: string,
): boolean | undefined {
  if (!isRecord(value)) return undefined;

  const result = value[key];

  return typeof result === "boolean" ? result : undefined;
}

function getArray(
  value: unknown,
  key: string,
): unknown[] {
  if (!isRecord(value)) return [];

  const result = value[key];

  return Array.isArray(result) ? result : [];
}

export function InteractiveContent({
  variant,
}: InteractiveContentProps) {
  if (
    variant.type !== "INTERACTIVE" ||
    !variant.interactiveType
  ) {
    return null;
  }

  switch (variant.interactiveType) {
    case "MULTIPLE_CHOICE":
      return (
        <MultipleChoice
          data={variant.data}
        />
      );

    case "TRUE_FALSE":
      return (
        <TrueFalse
          data={variant.data}
        />
      );

    case "MATCHING":
      return (
        <Matching
          data={variant.data}
        />
      );

    case "ORDERING":
      return (
        <Ordering
          data={variant.data}
        />
      );

    case "DRAG_DROP":
      return (
        <DragDrop
          data={variant.data}
        />
      );

    case "FLASHCARDS":
      return (
        <Flashcards
          data={variant.data}
        />
      );

    case "HOTSPOT":
      return (
        <UnsupportedInteractive
          title="النشاط التفاعلي"
          description="هذا النوع من الأنشطة لم يتم تنفيذ واجهته بعد."
        />
      );

    case "SIMULATION":
      return (
        <UnsupportedInteractive
          title="المحاكاة التفاعلية"
          description="هذا النوع من الأنشطة لم يتم تنفيذ واجهته بعد."
        />
      );

    default:
      return null;
  }
}

// ======================================================
// Multiple Choice
// ======================================================

function MultipleChoice({
  data,
}: {
  data: unknown;
}) {
  const question = getString(data, "question");
  const options = getArray(data, "options");

  const correctAnswer = getString(
    data,
    "correctAnswer",
  );

  const explanation = getString(
    data,
    "explanation",
  );

  const [selected, setSelected] = useState<string | null>(
    null,
  );

  const [submitted, setSubmitted] =
    useState(false);

  if (!question || !correctAnswer || options.length === 0) {
    return (
      <InvalidContent message="بيانات سؤال الاختيار من متعدد غير مكتملة." />
    );
  }

  const normalizedOptions = options
    .filter(isRecord)
    .map((option) => ({
      id:
        typeof option.id === "string"
          ? option.id
          : "",
      text:
        typeof option.text === "string"
          ? option.text
          : "",
    }))
    .filter(
      (option) => option.id && option.text,
    );

  const isCorrect =
    submitted && selected === correctAnswer;

  return (
    <Card className="border-default-200">
      <Card.Header>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            ?
          </span>

          <div>
            <Card.Title>
              اختيار من متعدد
            </Card.Title>

            <Card.Description>
              اختر الإجابة الصحيحة.
            </Card.Description>
          </div>
        </div>
      </Card.Header>

      <div className="space-y-6 px-4 pb-6 sm:px-6">
        <p className="text-base font-semibold leading-8">
          {question}
        </p>

        <RadioGroup
          value={selected ?? ""}
          onChange={(value) => {
            if (!submitted) {
              setSelected(value);
            }
          }}
        >
          <div className="space-y-3">
            {normalizedOptions.map((option) => {
              const isSelected =
                selected === option.id;

              const isAnswer =
                submitted &&
                option.id === correctAnswer;

              return (
                <div
                  key={option.id}
                  className={[
                    "rounded-xl border p-3 transition-colors",
                    isAnswer
                      ? "border-success bg-success/10"
                      : isSelected && submitted
                        ? "border-danger bg-danger/10"
                        : "border-default-200",
                  ].join(" ")}
                >
                  <Radio
                    value={option.id}
                    isDisabled={submitted}
                  >
                    {option.text}
                  </Radio>
                </div>
              );
            })}
          </div>
        </RadioGroup>

        {!submitted && (
          <Button
            
            isDisabled={!selected}
            onPress={() => setSubmitted(true)}
          >
            تحقق من الإجابة
          </Button>
        )}

        {submitted && (
          <ResultBox
            correct={isCorrect}
            explanation={explanation}
          />
        )}
      </div>
    </Card>
  );
}

// ======================================================
// True / False
// ======================================================

function TrueFalse({
  data,
}: {
  data: unknown;
}) {
  const question = getString(data, "question");

  const correctAnswer = getBoolean(
    data,
    "correctAnswer",
  );

  const explanation = getString(
    data,
    "explanation",
  );

  const [selected, setSelected] =
    useState<boolean | null>(null);

  const [submitted, setSubmitted] =
    useState(false);

  if (
    !question ||
    typeof correctAnswer !== "boolean"
  ) {
    return (
      <InvalidContent message="بيانات سؤال صح أو خطأ غير مكتملة." />
    );
  }

  const isCorrect =
    submitted &&
    selected === correctAnswer;

  return (
    <Card className="border-default-200">
      <Card.Header>
        <Card.Title>
          صح أم خطأ؟
        </Card.Title>

        <Card.Description>
          اقرأ العبارة ثم حدد الإجابة.
        </Card.Description>
      </Card.Header>

      <div className="space-y-6 px-4 pb-6 sm:px-6">
        <p className="text-base font-semibold leading-8">
          {question}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant={
              selected === true
                ? "primary"
                : "secondary"
            }
            isDisabled={submitted}
            onPress={() => setSelected(true)}
          >
            صح
          </Button>

          <Button
            variant={
              selected === false
                ? "primary"
                : "secondary"
            }
            isDisabled={submitted}
            onPress={() => setSelected(false)}
          >
            خطأ
          </Button>
        </div>

        {!submitted && (
          <Button
            
            isDisabled={selected === null}
            onPress={() => setSubmitted(true)}
          >
            تحقق من الإجابة
          </Button>
        )}

        {submitted && (
          <ResultBox
            correct={isCorrect}
            explanation={explanation}
          />
        )}
      </div>
    </Card>
  );
}

// ======================================================
// Matching
// ======================================================

function Matching({
  data,
}: {
  data: unknown;
}) {
  const pairs = getArray(data, "pairs");

  const normalizedPairs = pairs
    .filter(isRecord)
    .map((pair) => ({
      id:
        typeof pair.id === "string"
          ? pair.id
          : "",
      left:
        typeof pair.left === "string"
          ? pair.left
          : "",
      right:
        typeof pair.right === "string"
          ? pair.right
          : "",
    }))
    .filter(
      (pair) =>
        pair.id &&
        pair.left &&
        pair.right,
    );

  const [selected, setSelected] =
    useState<Record<string, string>>({});

  const [submitted, setSubmitted] =
    useState(false);

  if (normalizedPairs.length === 0) {
    return (
      <InvalidContent message="بيانات نشاط المطابقة غير مكتملة." />
    );
  }

  const rightOptions = useMemo(
    () =>
      [...normalizedPairs]
        .sort(() => Math.random() - 0.5),
    [normalizedPairs.length],
  );

  const allAnswered =
    normalizedPairs.every(
      (pair) => selected[pair.id],
    );

  const score = normalizedPairs.reduce(
    (total, pair) =>
      total +
      (selected[pair.id] === pair.right
        ? 1
        : 0),
    0,
  );

  return (
    <Card className="border-default-200">
      <Card.Header>
        <Card.Title>
          نشاط المطابقة
        </Card.Title>

        <Card.Description>
          صِل كل عنصر بما يناسبه.
        </Card.Description>
      </Card.Header>

      <div className="space-y-4 px-4 pb-6 sm:px-6">
        {normalizedPairs.map((pair) => (
          <div
            key={pair.id}
            className="grid gap-3 rounded-xl border border-default-200 p-4 sm:grid-cols-2"
          >
            <div className="flex items-center rounded-lg bg-default-50 p-3 text-sm font-semibold">
              {pair.left}
            </div>

            <select
              value={selected[pair.id] ?? ""}
              disabled={submitted}
              onChange={(event) =>
                setSelected((current) => ({
                  ...current,
                  [pair.id]: event.target.value,
                }))
              }
              className="min-h-11 rounded-lg border border-default-200 bg-content1 px-3 text-sm outline-none focus:border-primary"
            >
              <option value="">
                اختر المطابقة
              </option>

              {rightOptions.map((option) => (
                <option
                  key={option.id}
                  value={option.right}
                >
                  {option.right}
                </option>
              ))}
            </select>
          </div>
        ))}

        {!submitted && (
          <Button
            
            isDisabled={!allAnswered}
            onPress={() => setSubmitted(true)}
          >
            تحقق من الإجابات
          </Button>
        )}

        {submitted && (
          <ResultBox
            correct={
              score === normalizedPairs.length
            }
            explanation={`أجبت بشكل صحيح على ${score} من ${normalizedPairs.length}.`}
          />
        )}
      </div>
    </Card>
  );
}

// ======================================================
// Ordering
// ======================================================

function Ordering({
  data,
}: {
  data: unknown;
}) {
  const question = getString(
    data,
    "question",
  );

  const rawItems = getArray(
    data,
    "items",
  );

  const initialItems = rawItems
    .filter(isRecord)
    .map((item) => ({
      id:
        typeof item.id === "string"
          ? item.id
          : "",
      text:
        typeof item.text === "string"
          ? item.text
          : "",
      order:
        typeof item.order === "number"
          ? item.order
          : 0,
    }))
    .filter(
      (item) => item.id && item.text,
    )
    .sort(
      () => Math.random() - 0.5,
    );

  const [items, setItems] =
    useState(initialItems);

  const [submitted, setSubmitted] =
    useState(false);

  if (!question || items.length === 0) {
    return (
      <InvalidContent message="بيانات نشاط الترتيب غير مكتملة." />
    );
  }

  const moveItem = (
    index: number,
    direction: -1 | 1,
  ) => {
    const target = index + direction;

    if (
      target < 0 ||
      target >= items.length ||
      submitted
    ) {
      return;
    }

    setItems((current) => {
      const next = [...current];

      [
        next[index],
        next[target],
      ] = [
        next[target],
        next[index],
      ];

      return next;
    });
  };

  const isCorrect = items.every(
    (item, index) =>
      item.order === index + 1,
  );

  return (
    <Card className="border-default-200">
      <Card.Header>
        <Card.Title>
          رتب الخطوات
        </Card.Title>

        <Card.Description>
          {question}
        </Card.Description>
      </Card.Header>

      <div className="space-y-3 px-4 pb-6 sm:px-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-default-200 p-3"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
              {index + 1}
            </span>

            <span className="min-w-0 flex-1 text-sm font-medium">
              {item.text}
            </span>

            {!submitted && (
              <div className="flex shrink-0 gap-1">
                <Button
                  isIconOnly
                  size="sm"
                  variant="tertiary"
                  isDisabled={index === 0}
                  aria-label="تحريك لأعلى"
                  onPress={() =>
                    moveItem(index, -1)
                  }
                >
                  <ArrowUp />
                </Button>

                <Button
                  isIconOnly
                  size="sm"
                  variant="tertiary"
                  isDisabled={
                    index === items.length - 1
                  }
                  aria-label="تحريك لأسفل"
                  onPress={() =>
                    moveItem(index, 1)
                  }
                >
                  <ArrowDown />
                </Button>
              </div>
            )}
          </div>
        ))}

        {!submitted && (
          <Button
            
            onPress={() => setSubmitted(true)}
          >
            تحقق من الترتيب
          </Button>
        )}

        {submitted && (
          <ResultBox
            correct={isCorrect}
            explanation={
              isCorrect
                ? "الترتيب صحيح."
                : "الترتيب غير صحيح، حاول مراجعة الخطوات."
            }
          />
        )}
      </div>
    </Card>
  );
}

// ======================================================
// Drag & Drop
// ======================================================

function DragDrop({
  data,
}: {
  data: unknown;
}) {
  const question = getString(
    data,
    "question",
  );

  const categories = getArray(
    data,
    "categories",
  );

  const items = getArray(
    data,
    "items",
  );

  const normalizedCategories =
    categories
      .filter(isRecord)
      .map((category) => ({
        id:
          typeof category.id === "string"
            ? category.id
            : "",
        label:
          typeof category.label === "string"
            ? category.label
            : "",
      }))
      .filter(
        (category) =>
          category.id &&
          category.label,
      );

  const normalizedItems = items
    .filter(isRecord)
    .map((item) => ({
      id:
        typeof item.id === "string"
          ? item.id
          : "",
      text:
        typeof item.text === "string"
          ? item.text
          : "",
      categoryId:
        typeof item.categoryId === "string"
          ? item.categoryId
          : "",
    }))
    .filter(
      (item) =>
        item.id &&
        item.text &&
        item.categoryId,
    );

  const [answers, setAnswers] =
    useState<Record<string, string>>({});

  const [submitted, setSubmitted] =
    useState(false);

  if (
    !question ||
    normalizedCategories.length === 0 ||
    normalizedItems.length === 0
  ) {
    return (
      <InvalidContent message="بيانات نشاط التصنيف غير مكتملة." />
    );
  }

  const allAnswered =
    normalizedItems.every(
      (item) => answers[item.id],
    );

  const score = normalizedItems.reduce(
    (total, item) =>
      total +
      (answers[item.id] === item.categoryId
        ? 1
        : 0),
    0,
  );

  return (
    <Card className="border-default-200">
      <Card.Header>
        <Card.Title>
          صنّف العناصر
        </Card.Title>

        <Card.Description>
          {question}
        </Card.Description>
      </Card.Header>

      <div className="space-y-6 px-4 pb-6 sm:px-6">
        {normalizedItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-default-200 p-4"
          >
            <p className="mb-3 text-sm font-semibold">
              {item.text}
            </p>

            <select
              value={answers[item.id] ?? ""}
              disabled={submitted}
              onChange={(event) =>
                setAnswers((current) => ({
                  ...current,
                  [item.id]:
                    event.target.value,
                }))
              }
              className="min-h-11 w-full rounded-lg border border-default-200 bg-content1 px-3 text-sm outline-none focus:border-primary"
            >
              <option value="">
                اختر التصنيف
              </option>

              {normalizedCategories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.label}
                  </option>
                ),
              )}
            </select>
          </div>
        ))}

        {!submitted && (
          <Button
            
            isDisabled={!allAnswered}
            onPress={() => setSubmitted(true)}
          >
            تحقق من التصنيف
          </Button>
        )}

        {submitted && (
          <ResultBox
            correct={
              score === normalizedItems.length
            }
            explanation={`أجبت بشكل صحيح على ${score} من ${normalizedItems.length}.`}
          />
        )}
      </div>
    </Card>
  );
}

// ======================================================
// Flashcards
// ======================================================

function Flashcards({
  data,
}: {
  data: unknown;
}) {
  const cards = getArray(data, "cards");

  const normalizedCards = cards
    .filter(isRecord)
    .map((card) => ({
      id:
        typeof card.id === "string"
          ? card.id
          : "",
      front:
        typeof card.front === "string"
          ? card.front
          : "",
      back:
        typeof card.back === "string"
          ? card.back
          : "",
    }))
    .filter(
      (card) =>
        card.id &&
        card.front &&
        card.back,
    );

  const [current, setCurrent] =
    useState(0);

  const [flipped, setFlipped] =
    useState(false);

  if (normalizedCards.length === 0) {
    return (
      <InvalidContent message="بيانات البطاقات التعليمية غير مكتملة." />
    );
  }

  const card =
    normalizedCards[current];

  return (
    <Card className="border-default-200">
      <Card.Header>
        <Card.Title>
          البطاقات التعليمية
        </Card.Title>

        <Card.Description>
          اضغط على البطاقة لرؤية الإجابة.
        </Card.Description>
      </Card.Header>

      <div className="space-y-5 px-4 pb-6 sm:px-6">
        <button
          type="button"
          onClick={() =>
            setFlipped((value) => !value)
          }
          className="min-h-48 w-full rounded-2xl border border-default-200 bg-default-50 p-8 text-center outline-none transition hover:border-primary focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="text-xs font-medium text-default-400">
            {flipped ? "الإجابة" : "السؤال"}
          </span>

          <span className="mt-4 block text-lg font-bold leading-8">
            {flipped
              ? card.back
              : card.front}
          </span>
        </button>

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="secondary"
            isDisabled={current === 0}
            onPress={() => {
              setCurrent(
                (value) => value - 1,
              );
              setFlipped(false);
            }}
          >
            السابق
          </Button>

          <span className="text-sm text-default-500">
            {current + 1} /{" "}
            {normalizedCards.length}
          </span>

          <Button
            variant="secondary"
            isDisabled={
              current ===
              normalizedCards.length - 1
            }
            onPress={() => {
              setCurrent(
                (value) => value + 1,
              );
              setFlipped(false);
            }}
          >
            التالي
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ======================================================
// Result
// ======================================================

function ResultBox({
  correct,
  explanation,
}: {
  correct: boolean;
  explanation?: string;
}) {
  return (
    <div
      className={[
        "rounded-xl border p-4",
        correct
          ? "border-success/30 bg-success/10"
          : "border-danger/30 bg-danger/10",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        {correct ? (
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" />
        ) : (
          <CircleXmark className="mt-0.5 size-5 shrink-0 text-danger" />
        )}

        <div>
          <p className="font-semibold">
            {correct
              ? "إجابة صحيحة"
              : "إجابة غير صحيحة"}
          </p>

          {explanation && (
            <p className="mt-1 text-sm leading-7 text-default-600">
              {explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// Invalid content
// ======================================================

function InvalidContent({
  message,
}: {
  message: string;
}) {
  return (
    <Card className="border-danger/20">
      <div className="flex items-center gap-3 p-5">
        <CircleXmark className="size-5 text-danger" />

        <p className="text-sm text-danger">
          {message}
        </p>
      </div>
    </Card>
  );
}

// ======================================================
// Unsupported
// ======================================================

function UnsupportedInteractive({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-default-200">
      <Card.Header>
        <Card.Title>
          {title}
        </Card.Title>

        <Card.Description>
          {description}
        </Card.Description>
      </Card.Header>

      <div className="px-4 pb-5 sm:px-6">
        <div className="flex items-center gap-3 rounded-xl bg-default-50 p-4">
          <Trophy className="size-5 text-default-400" />

          <p className="text-sm text-default-500">
            سيتم دعم هذا النوع من الأنشطة في مرحلة لاحقة.
          </p>
        </div>
      </div>
    </Card>
  );
}