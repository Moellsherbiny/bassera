"use client";

import { ArrowUp, LoaderCircle, Plus } from "lucide-react";
import { Button } from "@heroui/react";
import { useRef } from "react";

type AiChatComposerProps = {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function AiChatComposer({
  value,
  loading,
  onChange,
  onSubmit,
}: AiChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="rounded-2xl border border-default bg-background shadow-sm transition-shadow focus-within:shadow-md">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="اكتب سؤالك هنا..."
        rows={2}
        maxLength={1000}
        disabled={loading}
        aria-label="اكتب سؤالك للمساعد التعليمي"
        className="max-h-40 min-h-16 w-full resize-y bg-transparent px-4 pt-4 text-sm leading-7 text-foreground outline-none placeholder:text-default-400 disabled:opacity-60"
      />

      <div className="flex items-center justify-between gap-3 px-3 pb-3">
        <div className="flex items-center gap-2 text-xs text-default-400">
          <Plus size={16} />
          <span>الإجابات الدراسية تعرض مصادرها عند توفرها</span>
        </div>

        <Button
          isIconOnly
          aria-label="إرسال السؤال"
          variant="primary"
          isDisabled={!value.trim() || loading}
          onPress={onSubmit}
          className="shrink-0"
        >
          {loading ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <ArrowUp size={19} />
          )}
        </Button>
      </div>
    </div>
  );
}