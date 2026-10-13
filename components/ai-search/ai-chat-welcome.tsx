"use client";

import {
  BookOpenText,
  Lightbulb,
  ListChecks,
  Sparkles,
} from "lucide-react";

const suggestions = [
  {
    title: "اشرح لي مفهومًا",
    description: "شرح واضح خطوة بخطوة",
    icon: BookOpenText,
    prompt: "اشرح لي أهم مفاهيم هذا المقرر بطريقة مبسطة.",
  },
  {
    title: "لخّص درسًا",
    description: "أهم الأفكار والنقاط",
    icon: ListChecks,
    prompt: "ساعدني في تلخيص أهم أفكار الدرس.",
  },
  {
    title: "اختبر فهمي",
    description: "أسئلة للمراجعة",
    icon: Lightbulb,
    prompt: "أنشئ لي أسئلة مراجعة من محتوى المقرر.",
  },
];

type AiChatWelcomeProps = {
  onSelect: (prompt: string) => void;
};

export function AiChatWelcome({
  onSelect,
}: AiChatWelcomeProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-12 md:px-8">
      <div className="mb-9">
        <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-default bg-surface">
          <Sparkles size={24} className="text-foreground" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          ماذا تريد أن تتعلّم اليوم؟
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-7 text-default-500 md:text-base">
          اسأل عن مفاهيم المقرر، استكشف الدروس، أو اطلب شرحًا يساعدك
          على فهم الموضوع بصورة أفضل.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {suggestions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => onSelect(item.prompt)}
              className="group rounded-2xl border border-default bg-surface p-4 text-start transition-colors hover:bg-surface-secondary"
            >
              <Icon
                size={20}
                className="mb-5 text-default-500 transition-colors group-hover:text-foreground"
              />

              <p className="text-sm font-semibold text-foreground">
                {item.title}
              </p>

              <p className="mt-1 text-xs leading-5 text-default-500">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}