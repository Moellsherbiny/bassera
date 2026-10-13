import { Card } from "@heroui/react";

export function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      {" "}
      <div className="flex items-center gap-3 p-4">
        {" "}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}{" "}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-default-400">{label}</p>

          <p className="mt-1 text-lg font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}


