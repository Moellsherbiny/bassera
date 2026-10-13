
"use client";

import { CircleCheck } from "@gravity-ui/icons";

import type {
  AnswerMap,
  QuizQuestion,
} from "@/types/quiz-types";

type QuizQuestionProps = {
  question: QuizQuestion;
  questionNumber: number;
  answers: AnswerMap;
  onSelect: (optionId: string) => void;
};

export function QuizQuestion({
  question,
  questionNumber,
  answers,
  onSelect,
}: QuizQuestionProps) {
  const selectedAnswers = answers[question.id] ?? [];

  const isMultipleChoice =
    question.type === "MULTIPLE_CHOICE";

  return (
    <div className="rounded-2xl border border-default-200 bg-content1">
      <div className="p-5 sm:p-7 md:p-8">
        {/* Question */}
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
            {questionNumber}
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-base font-bold leading-8 text-foreground sm:text-lg sm:leading-9">
              {question.text}
            </p>

            <p className="mt-2 text-xs text-foreground/45">
              {isMultipleChoice
                ? "يمكنك اختيار أكثر من إجابة"
                : "اختر إجابة واحدة"}
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="mt-7 space-y-3">
          {question.options.map((option, index) => {
            const selected = selectedAnswers.includes(
              option.id,
            );

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.id)}
                className={`
                  group flex w-full items-center gap-3
                  rounded-xl border p-3.5 text-right
                  outline-none transition-all sm:p-4
                  ${
                    selected
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-default-200 bg-background hover:border-primary/40 hover:bg-default-50"
                  }
                  focus-visible:ring-2
                  focus-visible:ring-primary
                `}
              >
                {/* Option Letter */}
                <span
                  className={`
                    flex size-9 shrink-0 items-center
                    justify-center rounded-lg border
                    text-sm font-bold transition-colors
                    ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-default-200 bg-content1 text-foreground/60 group-hover:border-primary/40"
                    }
                  `}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                {/* Text */}
                <span className="min-w-0 flex-1 break-words text-sm leading-7 sm:text-base">
                  {option.text}
                </span>

                {/* Selected */}
                {selected && (
                  <CircleCheck className="size-5 shrink-0 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
