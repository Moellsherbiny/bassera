import type { ReactNode } from "react";
import { Card, Link } from "@heroui/react";
type OverviewDashboardProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  /** * Main value displayed inside the card. * Example: "75%", "8 / 12", "92" */ value?:
    | string
    | number;
  /** * Optional label displayed under the main value. */ valueLabel?: string;
  /** * Optional footer link. */ linkLabel?: string;
  href?: string;
  /** * Custom icon color/classes. */ iconClassName?: string;
  /** * Custom card classes. */ className?: string;
};
export function OverviewDashboard({
  icon,
  title,
  description,
  value,
  valueLabel,
  linkLabel,
  href,
  iconClassName = "text-primary",
  className = "w-full",
}: OverviewDashboardProps) {
  return (
    <Card className={className}>
      {" "}
      <div className="flex items-start justify-between gap-4">
        {" "}
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 ${iconClassName}`}
        >
          {" "}
          {icon}{" "}
        </div>{" "}
        {value !== undefined && (
          <div className="text-end">
            {" "}
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {" "}
              {value}{" "}
            </div>{" "}
            {valueLabel && (
              <div className="mt-0.5 text-xs text-muted-foreground">
                {" "}
                {valueLabel}{" "}
              </div>
            )}{" "}
          </div>
        )}{" "}
      </div>{" "}
      <Card.Header>
        {" "}
        <Card.Title>{title}</Card.Title>{" "}
        {description && (
          <Card.Description> {description} </Card.Description>
        )}{" "}
      </Card.Header>{" "}
      {linkLabel && href && (
        <Card.Footer>
          {" "}
          <Link
            href={href}
            className="text-sm font-medium"
            aria-label={linkLabel}
          >
            {" "}
            {linkLabel} <Link.Icon aria-hidden="true" />{" "}
          </Link>{" "}
        </Card.Footer>
      )}{" "}
    </Card>
  );
}
