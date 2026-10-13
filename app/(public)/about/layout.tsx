import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حول",
};
export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-7xl px-6">
        {children}
      </div>
    </section>
  );
}