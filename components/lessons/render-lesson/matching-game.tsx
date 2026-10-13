import { MatchingData, MatchingPair } from "@/types/lessons";
import { useEffect, useState } from "react";

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function MatchingGame({
  pairs,
  data,
}: {
  pairs: MatchingPair[];
  data: Partial<MatchingData>;
}) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<string | null>(null);

const [shuffledRights, setShuffledRights] =
  useState<MatchingPair[]>(pairs);

useEffect(() => {
  setShuffledRights(shuffleArray(pairs));
}, [pairs]);

  const handleLeftClick = (pairId: string) => {
    if (matchedIds.includes(pairId)) return;

    setWrongPair(null);
    setSelectedLeft(pairId);
  };

  const handleRightClick = (rightPairId: string) => {
    if (!selectedLeft) return;

    const selectedPair = pairs.find(
      (pair) => pair.id === selectedLeft,
    );

    if (!selectedPair) return;

    if (selectedPair.id === rightPairId) {
      setMatchedIds((current) => [...current, selectedLeft]);
      setSelectedLeft(null);
      setWrongPair(null);

      return;
    }

    setWrongPair(`${selectedLeft}-${rightPairId}`);

    window.setTimeout(() => {
      setWrongPair(null);
      setSelectedLeft(null);
    }, 700);
  };

  const completed = matchedIds.length === pairs.length;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        {typeof data.title === "string" && (
          <h4 className="text-xl font-bold text-foreground">
            {data.title}
          </h4>
        )}

        {typeof data.instruction === "string" && (
          <p className="text-sm leading-7 text-default-500">
            {data.instruction}
          </p>
        )}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between rounded-xl bg-default-50 px-4 py-3">
        <span className="text-sm font-medium text-default-600">
          التقدم
        </span>

        <span className="text-sm font-bold text-primary">
          {matchedIds.length} / {pairs.length}
        </span>
      </div>

      {/* Matching */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Concepts */}
        <div className="space-y-3">
          <h5 className="text-sm font-bold text-default-700">
            المفاهيم والعناصر
          </h5>

          {pairs.map((pair) => {
            const isMatched = matchedIds.includes(pair.id);
            const isSelected = selectedLeft === pair.id;

            return (
              <button
                key={pair.id}
                type="button"
                disabled={isMatched}
                onClick={() => handleLeftClick(pair.id)}
                className={[
                  "w-full rounded-xl border p-4 text-right text-sm",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30",
                  isMatched
                    ? "cursor-default border-success/30 bg-success/10 text-success-700"
                    : isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-default-200 bg-background hover:border-primary/50 hover:bg-primary/5",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="leading-7">
                    {pair.left}
                  </span>

                  {isMatched && (
                    <span className="shrink-0 font-bold text-success">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Descriptions */}
        <div className="space-y-3">
          <h5 className="text-sm font-bold text-default-700">
            الأوصاف
          </h5>

          {shuffledRights.map((pair) => {
            const isMatched = matchedIds.includes(pair.id);

            const isWrong =
              wrongPair === `${selectedLeft}-${pair.id}`;

            return (
              <button
                key={pair.id}
                type="button"
                disabled={isMatched || !selectedLeft}
                onClick={() => handleRightClick(pair.id)}
                className={[
                  "w-full rounded-xl border p-4 text-right text-sm",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30",
                  isMatched
                    ? "cursor-default border-success/30 bg-success/10 text-success-700"
                    : isWrong
                      ? "border-danger bg-danger/10 text-danger"
                      : selectedLeft
                        ? "border-default-200 bg-background hover:border-primary/50 hover:bg-primary/5"
                        : "cursor-not-allowed border-default-100 bg-default-50 text-default-400",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="leading-7">
                    {pair.right}
                  </span>

                  {isMatched && (
                    <span className="shrink-0 font-bold text-success">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Instruction */}
      {!completed && (
        <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
          <p className="text-sm leading-7 text-primary">
            {selectedLeft
              ? "الآن اختر الوصف المناسب للمفهوم المحدد."
              : "اختر مفهومًا أو عنصرًا، ثم اختر الوصف المطابق له."}
          </p>
        </div>
      )}

      {/* Completed */}
      {completed && (
        <div className="rounded-xl border border-success/20 bg-success/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              ✓
            </div>

            <div>
              <p className="font-bold text-success-700">
                أحسنت!
              </p>

              <p className="mt-1 text-sm leading-6 text-success-700/80">
                تم إكمال جميع المطابقات بشكل صحيح.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}