import { BookOpen, CircleCheck, Play, Lock } from "@gravity-ui/icons";

export function LessonStatusBadge({
  status,
}: {
  status: "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "PASSED";
}) {
  const config = {
    LOCKED: {
      label: "مغلق",
      className: "bg-default-100 text-default-500",
      icon: Lock,
    },

    AVAILABLE: {
      label: "متاح",
      className: "bg-primary/10 text-primary",
      icon: BookOpen,
    },

    IN_PROGRESS: {
      label: "قيد التعلم",
      className: "bg-warning/10 text-warning-700",
      icon: Play,
    },

    PASSED: {
      label: "تم الاجتياز",
      className: "bg-success/10 text-success",
      icon: CircleCheck,
    },
  } as const;

  const current = config[status];
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${current.className}`}
    >
      {" "}
      <Icon className="size-3.5" />
      {current.label}{" "}
    </span>
  );
}


