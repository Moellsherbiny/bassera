
export default function Loading() {
  return (
    <main
      dir="rtl"
      className="min-h-[calc(100vh-4rem)] bg-background px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-4xl animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-default-200" />

        <div className="mt-3 h-4 w-72 rounded bg-default-100" />

        <div className="mt-8 h-2 w-full rounded-full bg-default-200" />

        <div className="mt-8 rounded-2xl border border-default-200 bg-content1 p-5 sm:p-8">
          <div className="h-6 w-3/4 rounded bg-default-200" />

          <div className="mt-8 space-y-3">
            <div className="h-14 rounded-xl bg-default-100" />
            <div className="h-14 rounded-xl bg-default-100" />
            <div className="h-14 rounded-xl bg-default-100" />
            <div className="h-14 rounded-xl bg-default-100" />
          </div>
        </div>
      </div>
    </main>
  );
}
