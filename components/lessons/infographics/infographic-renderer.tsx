"use client";

import HierarchyInfographic from "./hierarchy-infographic";
import OverviewInfographic from "./overview-infographic";
import StepsInfographic from "./steps-infographic";
import ProcessInfographic from "./process-infographic";
import CardsInfographic from "./cards-infographic";
import DiagramInfographic from "./diagram-infographic";
import ComparisonInfographic from "./comparison-infographic";

/* ============================================================
Types
============================================================ */

type InfographicStyle =
  | "HierarchyInfographic"
  | "OverviewInfographic"
  | "StepsInfographic"
  | "ProcessInfographic"
  | "CardsInfographic"
  | "DiagramInfographic"
  | "ComparisonInfographic";

type InfographicData = {
  intro?: string;
  style?: InfographicStyle;
  title?: string;
  summary?: string;
  sections?: unknown[];
};

type InfographicRendererProps = {
  data: unknown;
};

/* ============================================================
Renderer
============================================================ */

export default function InfographicRenderer({
  data,
}: InfographicRendererProps) {
  /*

* Validate the incoming data before rendering.
  */
  if (!data || typeof data !== "object") {
    return <InvalidInfographic message="لا يوجد محتوى إنفوجرافيك متاح." />;
  }

  const infographic = data as InfographicData;

  /*

* The AI-generated JSON must contain a `style`
* property that determines which infographic
* component should be rendered.
  */
  if (!infographic.style) {
    return <InvalidInfographic message="نوع الإنفوجرافيك غير محدد." />;
  }

  /*

* Make sure the required common fields exist.
*
* We intentionally do not block rendering if
* optional fields are missing because each
* infographic component can handle its own data.
  */
  switch (infographic.style) {
    case "HierarchyInfographic":
      return <HierarchyInfographic data={infographic as any} />;

    case "OverviewInfographic":
      return <OverviewInfographic data={infographic as any} />;

    case "StepsInfographic":
      return <StepsInfographic data={infographic as any} />;

    case "ProcessInfographic":
      return <ProcessInfographic data={infographic as any} />;

    case "CardsInfographic":
      return <CardsInfographic data={infographic as any} />;

    case "DiagramInfographic":
      return <DiagramInfographic data={infographic as any} />;

    case "ComparisonInfographic":
      return <ComparisonInfographic data={infographic as any} />;

    default:
      return (
        <InvalidInfographic
          message={`نوع الإنفوجرافيك "${String(infographic.style)}" غير مدعوم.`}
        />
      );
  }
}

/* ============================================================
Invalid State 
============================================================ */

function InvalidInfographic({ message }: { message: string }) {
  return (
    <div
      dir="rtl"
      className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-default-300 bg-default-50 px-6 py-10 text-center"
    >
      {" "}
      <div>
        {" "}
        <p className="text-sm font-semibold text-default-600">{message} </p>
        <p className="mt-2 text-xs leading-6 text-default-400">
          تأكد من أن بيانات الإنفوجرافيك تحتوي على
          <code className="mx-1 rounded bg-default-100 px-1.5 py-0.5">
            style
          </code>
          صحيح.
        </p>
      </div>
    </div>
  );
}
