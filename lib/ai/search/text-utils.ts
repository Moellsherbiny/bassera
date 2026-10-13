import type { GeneratedAnswer, RagGeneratedAnswer } from "./types";

export function isGreeting(message: string): boolean {
  const normalized = message
    .trim()
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[؟?!.,،؛]/g, "")
    .replace(/\s+/g, " ");

  const greetings = [
    "السلام عليكم",
    "السلام عليكم ورحمة الله",
    "السلام عليكم ورحمة الله وبركاته",
    "صباح الخير",
    "مساء الخير",
    "مرحبا",
    "مرحباً",
    "اهلا",
    "أهلا",
    "اهلا وسهلا",
    "أهلاً وسهلاً",
    "هاي",
    "ازيك",
    "إزيك",
    "شكرا",
    "شكراً",
  ];

  return greetings.includes(normalized);
}

export function extractCitationIndexes(
  answer: string,
): number[] {
  const normalized = answer.replace(/[٠-٩]/g, (digit) =>
    String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)),
  );

  return [
    ...new Set(
      Array.from(
        normalized.matchAll(/\[المصدر\s*(\d+)\]/g),
      ).map((match) => Number(match[1])),
    ),
  ];
}

export function parseGeneratedAnswer(
  text: string,
): GeneratedAnswer {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end <= start) {
    throw new Error("Gemini returned invalid JSON");
  }

  const parsed: unknown = JSON.parse(
    cleaned.slice(start, end + 1),
  );

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid Gemini response");
  }

  const data = parsed as Record<string, unknown>;

  if (
    typeof data.answer !== "string" ||
    !data.answer.trim() ||
    !Array.isArray(data.sourceIndexes) ||
    !data.sourceIndexes.every(
      (index) =>
        typeof index === "number" &&
        Number.isInteger(index) &&
        index >= 1,
    )
  ) {
    throw new Error("Invalid answer structure");
  }

  if (
    data.mode !== "course" &&
    data.mode !== "gemini_fallback"
  ) {
    throw new Error("Invalid answer mode");
  }

  return {
    answer: data.answer.trim(),
    mode: data.mode,
    sourceIndexes: [...new Set(data.sourceIndexes as number[])],
  };
}

export function validateCitations(
  result: RagGeneratedAnswer,
  sourceCount: number,
): boolean {
  if (result.mode !== "course") return false;

  if (
    sourceCount === 0 ||
    result.sourceIndexes.length === 0
  ) {
    return false;
  }

  const citedIndexes = extractCitationIndexes(result.answer);
  const validIndexes = new Set(
    Array.from({ length: sourceCount }, (_, i) => i + 1),
  );

  return (
    result.sourceIndexes.every(
      (index) => validIndexes.has(index),
    ) &&
    citedIndexes.length > 0 &&
    citedIndexes.every((index) =>
      result.sourceIndexes.includes(index),
    ) &&
    result.sourceIndexes.every((index) =>
      citedIndexes.includes(index),
    )
  );
}