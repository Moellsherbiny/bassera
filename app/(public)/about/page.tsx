export default function AboutPage() {
  return (
    <main>
      {/* Header */}
      <section className="border-b border-divider">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold text-primary">
              عن بَصيرة
            </span>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              بيئة تعليمية تكيفية
              <span className="block text-primary">
                مدعومة بالذكاء الاصطناعي
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-default-500">
              بَصيرة هي بيئة تعليمية تهدف إلى تقديم تجربة تعلم أكثر
              وضوحًا وتفاعلًا من خلال الجمع بين التعلم التكيفي،
              والذكاء الاصطناعي، والمحتوى التعليمي البصري.
            </p>
          </div>
        </div>
      </section>

      {/* Concept */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">
                فكرة النظام
              </h2>

              <p className="mt-5 leading-8 text-default-500">
                يعتمد النظام على تقديم المحتوى التعليمي من خلال
                مجموعة متنوعة من الوسائط، مثل الـInfographics
                والفيديو والأنشطة التفاعلية، مع الاستفادة من
                بيانات أداء المتعلم لتقديم تجربة تعليمية تكيفية.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                دور الذكاء الاصطناعي
              </h2>

              <p className="mt-5 leading-8 text-default-500">
                يستخدم النظام تقنيات الذكاء الاصطناعي للمساعدة في
                تحليل تفاعل المتعلم وأدائه، ودعم عملية التكيف مع
                احتياجاته التعليمية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Components */}
      <section className="border-t border-divider bg-default-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-primary">
              مكونات البيئة التعليمية
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              تجربة تعلم متعددة الوسائط
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Feature
              title="Infographics"
              description="عرض المفاهيم والمعلومات بطريقة بصرية تساعد على الفهم."
            />

            <Feature
              title="Video Learning"
              description="استخدام الفيديو كوسيلة داعمة لشرح المحتوى التعليمي."
            />

            <Feature
              title="Interactive Activities"
              description="أنشطة وتقييمات تتيح للمتعلم التفاعل مع المحتوى."
            />

            <Feature
              title="Adaptive Learning"
              description="تكييف تجربة التعلم بناءً على أداء المتعلم وتفاعله."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-divider bg-background p-6">
      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-default-500">
        {description}
      </p>
    </article>
  );
}