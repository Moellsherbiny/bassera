import {prisma } from "@/lib/prisma";
console.log(">>> seed-interactive.ts STARTED");
const LESSON_IDS = {
  lesson1: "cmtqz5z9r0006jcv755mknbwv",
  lesson2: "cmtqz5zbo0008jcv76kanj5bn",
  lesson3: "cmtqz5zd2000ajcv75mqkod3f",
  lesson4: "cmtqz5zez000cjcv71bcpwxt3",
};

async function main() {
  console.log("Seeding interactive lesson contents...");

  await prisma.lessonContent.createMany({
    data: [
      // =========================================================
      // LESSON 1
      // =========================================================

      {
        lessonId: LESSON_IDS.lesson1,
        type: "INTERACTIVE",
        interactiveType: "MATCHING",
        isSimplified: false,
        isSplitIntoParts: false,
        hasGraphics: true,
        variantOrder: 5,
        generatedByAI: false,
        data: {
          title: "طابق نظام المعلومات مع وظيفته",
          instruction:
            "صل كل نوع من نظم المعلومات بالوصف الذي يناسب وظيفته.",
          pairs: [
            {
              id: "tps",
              left: "نظم معالجة المعاملات (TPS)",
              right:
                "معالجة البيانات الناتجة عن مبادلات الأعمال اليومية وخدمة المستوى التشغيلي.",
            },
            {
              id: "mis",
              left: "نظم المعلومات الإدارية (MIS)",
              right:
                "توفير التقارير الروتينية عن الأداء الحالي والتاريخي للإدارة الوسطى.",
            },
            {
              id: "dss",
              left: "نظم دعم القرار (DSS)",
              right:
                "مساعدة المديرين في القرارات الفريدة وتوفير مجموعة من البدائل.",
            },
            {
              id: "ess",
              left: "نظم دعم الإدارة التنفيذية (ESS)",
              right:
                "دعم الإدارة العليا في اتخاذ القرارات الاستراتيجية وغير المهيكلة.",
            },
            {
              id: "oas",
              left: "نظم ميكنة المكاتب (OAS)",
              right:
                "استخدام تكنولوجيا المعلومات لزيادة إنتاجية وفعالية العاملين في المكتب.",
            },
            {
              id: "es",
              left: "النظم الخبيرة (ES)",
              right:
                "تقديم النصائح والحلول اعتمادًا على المعرفة والخبرة في مجال معين.",
            },
          ],
        },
      },

      {
        lessonId: LESSON_IDS.lesson1,
        type: "INTERACTIVE",
        interactiveType: "DRAG_DROP",
        isSimplified: false,
        isSplitIntoParts: false,
        hasGraphics: true,
        variantOrder: 6,
        generatedByAI: false,
        data: {
          title: "صنّف مجالات نظم ميكنة الأعمال المكتبية",
          instruction:
            "اسحب كل عنصر إلى مجال ميكنة الأعمال المكتبية المناسب له.",
          categories: [
            {
              id: "documents",
              title: "إنتاج الوثائق المطبوعة",
            },
            {
              id: "images",
              title: "معالجة الصور والرسومات",
            },
            {
              id: "communication",
              title: "الاتصالات الإلكترونية",
            },
            {
              id: "time",
              title: "تنظيم وإدارة الوقت",
            },
          ],
          items: [
            {
              id: "word-processing",
              text: "نظم معالجة الكلمات",
              categoryId: "documents",
            },
            {
              id: "desktop-publishing",
              text: "نظم النشر المكتبي",
              categoryId: "documents",
            },
            {
              id: "image-processing",
              text: "نظم معالجة الصور",
              categoryId: "images",
            },
            {
              id: "electronic-graphics",
              text: "نظم الصور البيانية الإلكترونية",
              categoryId: "images",
            },
            {
              id: "fax",
              text: "الفاكسيميلي",
              categoryId: "communication",
            },
            {
              id: "email",
              text: "البريد الإلكتروني",
              categoryId: "communication",
            },
            {
              id: "voice-mail",
              text: "البريد الصوتي",
              categoryId: "communication",
            },
            {
              id: "teleconference",
              text: "اللقاءات والمقابلات الإلكترونية عن بعد",
              categoryId: "communication",
            },
            {
              id: "calendar",
              text: "الأجندة الإلكترونية",
              categoryId: "time",
            },
            {
              id: "todo",
              text: "قائمة المهام TO DO List",
              categoryId: "time",
            },
            {
              id: "project-management",
              text: "نظم إدارة تنفيذ المشروعات",
              categoryId: "time",
            },
          ],
        },
      },

      {
        lessonId: LESSON_IDS.lesson1,
        type: "INTERACTIVE",
        interactiveType: "ORDERING",
        isSimplified: false,
        isSplitIntoParts: false,
        hasGraphics: false,
        variantOrder: 7,
        generatedByAI: false,
        data: {
          title: "رتّب مراحل تخطيط وتنفيذ ميكنة الأعمال المكتبية",
          instruction:
            "رتّب المراحل التالية بالترتيب الصحيح كما وردت في الدرس.",
          items: [
            {
              id: "analysis",
              text: "الدراسة والتحليل",
              correctOrder: 1,
            },
            {
              id: "design",
              text: "التصميم",
              correctOrder: 2,
            },
            {
              id: "implementation",
              text: "التنفيذ",
              correctOrder: 3,
            },
            {
              id: "evaluation",
              text: "التقييم",
              correctOrder: 4,
            },
          ],
        },
      },

      {
        lessonId: LESSON_IDS.lesson1,
        type: "INTERACTIVE",
        interactiveType: "TRUE_FALSE",
        isSimplified: false,
        isSplitIntoParts: true,
        hasGraphics: false,
        variantOrder: 8,
        generatedByAI: false,
        data: {
          title: "اختبر فهمك",
          instruction:
            "اقرأ العبارة وحدد هل هي صحيحة أم خاطئة وفقًا لمحتوى الدرس.",
          questions: [
            {
              id: "q1",
              statement:
                "تساعد نظم ميكنة الأعمال المكتبية على اختصار الوقت اللازم لأداء الأعمال المكتبية.",
              correctAnswer: true,
              explanation:
                "الاعتماد على تكنولوجيا الحاسبات والاتصالات يؤدي إلى توفير الوقت.",
            },
            {
              id: "q2",
              statement:
                "من فوائد نظم ميكنة الأعمال المكتبية زيادة استخدام الورق والأرشيف.",
              correctAnswer: false,
              explanation:
                "من فوائدها تقليل استخدام الورق والأرشيف.",
            },
            {
              id: "q3",
              statement:
                "تطبق نظم ميكنة الأعمال المكتبية على مستوى المستخدم الفردي وجماعة العمل والمنظمة ككل.",
              correctAnswer: true,
              explanation:
                "يذكر الدرس ثلاثة مستويات لتطبيق نظم ميكنة الأعمال المكتبية.",
            },
            {
              id: "q4",
              statement:
                "التحول بالتوازي يعني إيقاف النظام القديم وتشغيل النظام الجديد فقط.",
              correctAnswer: false,
              explanation:
                "في التحول بالتوازي يعمل النظام القديم والجديد جنبًا إلى جنب.",
            },
            {
              id: "q5",
              statement:
                "لا يمكن تصميم نظام جديد دون تحليل مفصل للنظام الحالي.",
              correctAnswer: true,
              explanation:
                "يذكر الدرس أن التصميم يعتمد على تحليل مفصل للنظام الحالي.",
            },
            {
              id: "q6",
              statement:
                "تتضمن مرحلة التنفيذ اختبار النظام وتدريب العاملين وتركيب النظام.",
              correctAnswer: true,
              explanation:
                "هذه من العناصر المذكورة ضمن مرحلة التنفيذ.",
            },
          ],
        },
      },

      // =========================================================
      // LESSON 2
      // =========================================================

      {
        lessonId: LESSON_IDS.lesson2,
        type: "INTERACTIVE",
        interactiveType: "MATCHING",
        isSimplified: false,
        isSplitIntoParts: false,
        hasGraphics: true,
        variantOrder: 5,
        generatedByAI: false,
        data: {
          title: "طابق المفهوم مع الوصف المناسب",
          instruction:
            "صل كل مفهوم من مفاهيم نظم معالجة الكلمات بالوصف الذي يناسبه.",
          pairs: [
            {
              id: "word-processing",
              left: "نظم معالجة الكلمات",
              right:
                "برامج تسمح بكتابة النص وتخزينه وتنسيقه وتعديله وطباعته.",
            },
            {
              id: "traditional",
              left: "النظم التقليدية لمعالجة الكلمات",
              right:
                "تعتمد على أجهزة إلكترونية متخصصة في معالجة الكلمات مثل الآلة الكاتبة ومحطات العمل Display.",
            },
            {
              id: "modern",
              left: "النظم الحديثة لمعالجة الكلمات",
              right:
                "تعتمد على الحاسب الشخصي وبرنامج لمعالجة الكلمات وطابعة.",
            },
            {
              id: "spell-check",
              left: "التدقيق الإملائي",
              right:
                "يقارن الكلمات المكتوبة بالكلمات الموجودة في قاموس أو قاعدة بيانات ويقترح بدائل عند وجود خطأ.",
            },
            {
              id: "grammar-check",
              left: "التدقيق النحوي",
              right:
                "يطابق الجمل المدخلة مع قواعد اللغة المعروفة ويشير إلى الحاجة لإعادة النظر.",
            },
          ],
        },
      },

      {
        lessonId: LESSON_IDS.lesson2,
        type: "INTERACTIVE",
        interactiveType: "DRAG_DROP",
        isSimplified: false,
        isSplitIntoParts: false,
        hasGraphics: true,
        variantOrder: 6,
        generatedByAI: false,
        data: {
          title: "صنّف إمكانيات برامج معالجة الكلمات",
          instruction:
            "اسحب كل إمكانية إلى المجموعة المناسبة لها.",
          categories: [
            {
              id: "formatting",
              title: "الكتابة والتنسيق",
            },
            {
              id: "insertion",
              title: "الإدراج",
            },
            {
              id: "document-management",
              title: "إدارة المستند",
            },
            {
              id: "communication",
              title: "الإرسال والتكامل",
            },
          ],
          items: [
            {
              id: "multi-language",
              text: "كتابة النصوص بلغات متعددة",
              categoryId: "formatting",
            },
            {
              id: "font-size",
              text: "تغيير حجم الخط",
              categoryId: "formatting",
            },
            {
              id: "text-alignment",
              text: "محاذاة النص",
              categoryId: "formatting",
            },
            {
              id: "line-spacing",
              text: "تغيير التباعد بين أسطر المستند",
              categoryId: "formatting",
            },
            {
              id: "images",
              text: "إدراج الصور",
              categoryId: "insertion",
            },
            {
              id: "tables",
              text: "إنشاء الجداول وتنسيقها",
              categoryId: "insertion",
            },
            {
              id: "symbols",
              text: "إدراج الرموز المتنوعة",
              categoryId: "insertion",
            },
            {
              id: "hyperlink",
              text: "إدراج الارتباط التشعبي",
              categoryId: "insertion",
            },
            {
              id: "search-replace",
              text: "البحث والاستبدال داخل المستند",
              categoryId: "document-management",
            },
            {
              id: "password",
              text: "حماية المستند بكلمة مرور",
              categoryId: "document-management",
            },
            {
              id: "preview-print",
              text: "معاينة المستند وطباعته",
              categoryId: "document-management",
            },
            {
              id: "email",
              text: "إرسال المستند عبر البريد الإلكتروني",
              categoryId: "communication",
            },
            {
              id: "fax",
              text: "إرسال المستند عبر الفاكس",
              categoryId: "communication",
            },
            {
              id: "powerpoint",
              text: "إرسال المستند إلى برنامج PowerPoint كعرض تقديمي",
              categoryId: "communication",
            },
          ],
        },
      },

      {
        lessonId: LESSON_IDS.lesson2,
        type: "INTERACTIVE",
        interactiveType: "ORDERING",
        isSimplified: false,
        isSplitIntoParts: false,
        hasGraphics: false,
        variantOrder: 7,
        generatedByAI: false,
        data: {
          title: "رتّب مكونات نظام معالجة الكلمات الحديث",
          instruction:
            "رتّب المكونات التالية كما يحتاجها تطبيق نظم معالجة الكلمات الحديثة.",
          items: [
            {
              id: "computer",
              text: "حاسب شخصي متعدد الأغراض",
              correctOrder: 1,
            },
            {
              id: "software",
              text: "برنامج خاص بمعالجة الكلمات",
              correctOrder: 2,
            },
            {
              id: "printer",
              text: "طابعة لاستخراج الوثائق",
              correctOrder: 3,
            },
          ],
        },
      },

      {
        lessonId: LESSON_IDS.lesson2,
        type: "INTERACTIVE",
        interactiveType: "TRUE_FALSE",
        isSimplified: false,
        isSplitIntoParts: true,
        hasGraphics: false,
        variantOrder: 8,
        generatedByAI: false,
        data: {
          title: "اختبر فهمك في نظم معالجة الكلمات",
          instruction:
            "اقرأ كل عبارة وحدد هل هي صحيحة أم خاطئة وفقًا لمحتوى الدرس.",
          questions: [
            {
              id: "q1",
              statement:
                "تسمح نظم معالجة الكلمات بكتابة النص وتخزينه وتنسيقه وتعديله وطباعته.",
              correctAnswer: true,
              explanation:
                "هذا هو المفهوم الأساسي لنظم معالجة الكلمات الوارد في الدرس.",
            },
            {
              id: "q2",
              statement:
                "النظم التقليدية لمعالجة الكلمات كانت متعددة الوظائف ويمكن تحديثها بسهولة.",
              correctAnswer: false,
              explanation:
                "ذكر الدرس أن من عيوب الأجهزة التقليدية صعوبة التعديل والتحديث، وأنها تؤدي وظيفة واحدة فقط هي معالجة الكلمات.",
            },
            {
              id: "q3",
              statement:
                "يتكون نظام معالجة الكلمات الحديث من حاسب شخصي وبرنامج لمعالجة الكلمات وطابعة.",
              correctAnswer: true,
              explanation:
                "هذه هي المكونات الأساسية المذكورة لنظم معالجة الكلمات الحديثة.",
            },
            {
              id: "q4",
              statement:
                "يمكن لبرامج معالجة الكلمات إدراج الصور والجداول والرسوم البيانية داخل المستند.",
              correctAnswer: true,
              explanation:
                "يذكر الدرس إمكانية إدراج الصور والجداول والتخطيطات والرسوم البيانية.",
            },
            {
              id: "q5",
              statement:
                "التدقيق الإملائي يعتمد على مطابقة الجمل مع قواعد اللغة.",
              correctAnswer: false,
              explanation:
                "مطابقة الجمل مع قواعد اللغة من وظيفة التدقيق النحوي، بينما التدقيق الإملائي يقارن الكلمات بقاموس أو قاعدة بيانات.",
            },
            {
              id: "q6",
              statement:
                "يمكن لبرامج معالجة الكلمات البحث عن نص معين واستبداله داخل المستند.",
              correctAnswer: true,
              explanation:
                "البحث والاستبدال من الإمكانيات المذكورة ضمن وظائف برامج معالجة الكلمات.",
            },
            {
              id: "q7",
              statement:
                "يمكن حفظ المستند كقالب Template لاستخدامه في مستندات أخرى.",
              correctAnswer: true,
              explanation:
                "يذكر الدرس إمكانية إنشاء قوالب تصلح للاستخدام في مستندات عديدة.",
            },
            {
              id: "q8",
              statement:
                "التدقيق النحوي يقوم بمقارنة الكلمات المفردة فقط مع قاموس الكلمات.",
              correctAnswer: false,
              explanation:
                "التدقيق النحوي يطابق الجمل المدخلة مع قواعد اللغة المعروفة.",
            },
          ],
        },
      },

      // =========================================================
      // LESSON 3
      // =========================================================

      {
        lessonId: LESSON_IDS.lesson3,
        type: "INTERACTIVE",
        interactiveType: "MATCHING",
        isSimplified: false,
        isSplitIntoParts: false,
        hasGraphics: true,
        variantOrder: 5,
        generatedByAI: false,
        data: {
          title: "طابق المفهوم مع الوصف المناسب",
          instruction:
            "صل كل مفهوم أو عنصر بالوصف المناسب له وفقًا لمحتوى الدرس.",
          pairs: [
            {
              id: "dtp",
              left: "النشر المكتبي DTP",
              right:
                "استخدام الحاسب والبرمجيات المتخصصة للجمع بين النص والرسوم لإنتاج وثيقة مطبوعة عالية الجودة.",
            },
            {
              id: "publisher",
              left: "Microsoft Office Publisher 2003",
              right:
                "برنامج للنشر وتصميم مواد الطباعة والبريد الإلكتروني والويب.",
            },
            {
              id: "title-bar",
              left: "شريط العنوان",
              right:
                "يتضمن اسم البرنامج بالإضافة إلى أزرار التكبير والتصغير والخروج.",
            },
            {
              id: "task-pane",
              left: "جزء المهام",
              right:
                "يحتوي على تصاميم وقوالب جاهزة تساعد في إنشاء المنشورات.",
            },
            {
              id: "publication-list",
              left: "قائمة المنشورات",
              right:
                "تعرض محتويات البند المحدد من بنود المنشور الجديد.",
            },
          ],
        },
      },

      {
        lessonId: LESSON_IDS.lesson3,
        type: "INTERACTIVE",
        interactiveType: "DRAG_DROP",
        isSimplified: false,
        isSplitIntoParts: false,
        hasGraphics: true,
        variantOrder: 6,
        generatedByAI: false,
        data: {
          title: "صنّف أنواع تصميمات Publisher",
          instruction:
            "اسحب كل نوع من التصميمات إلى المجموعة المناسبة له.",
          categories: [
            {
              id: "cards",
              title: "البطاقات",
            },
            {
              id: "office",
              title: "المجموعات المكتبية",
            },
            {
              id: "web",
              title: "مواقع الويب",
            },
            {
              id: "email",
              title: "منشورات البريد الإلكتروني",
            },
          ],
          items: [
            {
              id: "greeting-cards",
              text: "بطاقات تحية وبطاقات دعوة",
              categoryId: "cards",
            },
            {
              id: "dvd-covers",
              text: "بطاقات عنوان وأغلفة CD/DVD",
              categoryId: "cards",
            },
            {
              id: "office-stationery",
              text: "مجموعات مكتبية شخصية",
              categoryId: "office",
            },
            {
              id: "website",
              text: "مواقع ويب",
              categoryId: "web",
            },
            {
              id: "product-sales",
              text: "صفحة مبيعات المنتج أو الخدمات المتخصصة",
              categoryId: "web",
            },
            {
              id: "email-message",
              text: "رسالة بريد إلكتروني",
              categoryId: "email",
            },
            {
              id: "newsletter",
              text: "رسالة إخبارية",
              categoryId: "email",
            },
            {
              id: "product-list",
              text: "قائمة منتجات",
              categoryId: "email",
            },
            {
              id: "featured-product",
              text: "منتج مميز",
              categoryId: "email",
            },
          ],
        },
      },

      {
        lessonId: LESSON_IDS.lesson3,
        type: "INTERACTIVE",
        interactiveType: "ORDERING",
        isSimplified: false,
        isSplitIntoParts: true,
        hasGraphics: false,
        variantOrder: 7,
        generatedByAI: false,
        data: {
          title: "رتّب خطوات إنشاء دعوة",
          instruction:
            "رتّب الخطوات التالية بالترتيب الصحيح لإنشاء دعوة باستخدام Publisher.",
          items: [
            {
              id: "open-publisher",
              text:
                "فتح Microsoft Office Publisher 2003 واختيار منشور جديد.",
              correctOrder: 1,
            },
            {
              id: "file-new",
              text: "من قائمة ملف اختيار جديد.",
              correctOrder: 2,
            },
            {
              id: "print-publications",
              text:
                "من جزء المهام اختيار منشورات للطباعة.",
              correctOrder: 3,
            },
            {
              id: "invitation",
              text:
                "اختيار بطاقة دعوة ثم اختيار احتفال تخرج، دعوة.",
              correctOrder: 4,
            },
            {
              id: "page-one",
              text:
                "اختيار التنسيق المناسب للصفحة الأولى واستكمال البيانات.",
              correctOrder: 5,
            },
            {
              id: "pages-two-three",
              text:
                "الانتقال إلى الصفحة الثانية والثالثة واختيار التنسيق واستكمال البيانات.",
              correctOrder: 6,
            },
            {
              id: "page-four",
              text:
                "الانتقال إلى الصفحة الرابعة واختيار التنسيق المناسب وإدراج صورة عند الحاجة.",
              correctOrder: 7,
            },
            {
              id: "save",
              text:
                "اختيار أمر حفظ وتحديد مكان واسم ونوع الملف ثم الضغط على حفظ.",
              correctOrder: 8,
            },
          ],
        },
      },

      {
        lessonId: LESSON_IDS.lesson3,
        type: "INTERACTIVE",
        interactiveType: "TRUE_FALSE",
        isSimplified: false,
        isSplitIntoParts: true,
        hasGraphics: false,
        variantOrder: 8,
        generatedByAI: false,
        data: {
          title: "اختبر فهمك في النشر المكتبي",
          instruction:
            "اقرأ العبارة وحدد هل هي صحيحة أم خاطئة وفقًا لمحتوى الدرس.",
          questions: [
            {
              id: "q1",
              statement:
                "يركز النشر المكتبي على عناصر التصميم والمظهر المرئي للوثائق.",
              correctAnswer: true,
              explanation:
                "يوضح الدرس أن برامج النشر المكتبي تؤكد على عناصر التصميم والمظهر المرئي للوثائق.",
            },
            {
              id: "q2",
              statement:
                "يستخدم النشر المكتبي عمومًا للوثائق القصيرة مثل الإعلانات والكتيبات والتقارير.",
              correctAnswer: true,
              explanation:
                "ذكر الدرس أن النشر المكتبي يستخدم عمومًا للوثائق القصيرة مثل الإعلانات والكتيبات والتقارير.",
            },
            {
              id: "q3",
              statement:
                "لا يمكن استخدام Publisher لإنشاء مواد للطباعة أو البريد الإلكتروني أو الويب.",
              correctAnswer: false,
              explanation:
                "يوضح الدرس أن Publisher يمكن استخدامه لإنشاء مواد للطباعة والبريد الإلكتروني والويب.",
            },
            {
              id: "q4",
              statement:
                "جزء المهام في Publisher يحتوي على تصاميم وقوالب جاهزة يمكن تعديلها حسب الحاجة.",
              correctAnswer: true,
              explanation:
                "يحتوي جزء المهام على مجموعة من التصاميم الجاهزة التي يمكن استخدامها والتعديل عليها.",
            },
            {
              id: "q5",
              statement:
                "قائمة المنشورات تعرض محتويات البند المحدد من بنود المنشور الجديد.",
              correctAnswer: true,
              explanation:
                "هذه هي وظيفة قائمة المنشورات كما وردت في الدرس.",
            },
            {
              id: "q6",
              statement:
                "بطاقة الدعوة في المثال الوارد بالدرس تتكون من أربع صفحات.",
              correctAnswer: true,
              explanation:
                "ذكر الدرس أن بطاقة الدعوة تتكون من 4 صفحات.",
            },
            {
              id: "q7",
              statement:
                "عند إنشاء الكتالوج لا يمكن زيادة أو تقليل عدد صفحاته.",
              correctAnswer: false,
              explanation:
                "يوضح الدرس إمكانية زيادة أو تقليل عدد صفحات الكتالوج.",
            },
            {
              id: "q8",
              statement:
                "برامج النشر المكتبي تهتم فقط بكتابة النصوص ولا تهتم بالرسومات والتصميم.",
              correctAnswer: false,
              explanation:
                "النشر المكتبي يجمع بين النص والرسوم ويؤكد على التصميم والمظهر المرئي للوثيقة.",
            },
          ],
        },
      },

      // =========================================================
      // LESSON 4
      // =========================================================

      {
        lessonId: LESSON_IDS.lesson4,
        type: "INTERACTIVE",
        interactiveType: "MATCHING",
        isSimplified: false,
        isSplitIntoParts: false,
        hasGraphics: true,
        variantOrder: 5,
        generatedByAI: false,
        data: {
          title: "طابق طريقة العرض مع وصفها",
          instruction:
            "صل كل طريقة أو نوع من أنواع عرض البيانات بالوصف المناسب لها.",
          pairs: [
            {
              id: "tabular",
              left: "العرض الجدولي",
              right:
                "ترتيب منظم للبيانات في صورة جداول ذات صفوف وأعمدة.",
            },
            {
              id: "graphical",
              left: "العرض البياني",
              right:
                "عرض البيانات الإحصائية في صورة رسوم وأشكال بيانية تساعد على فهمها ومقارنتها.",
            },
            {
              id: "historical",
              left: "الترتيب التاريخي",
              right:
                "ترتيب البيانات وفقًا للتسلسل الزمني.",
            },
            {
              id: "alphabetical",
              left: "الترتيب الأبجدي",
              right:
                "ترتيب البيانات وفقًا للحروف الأبجدية.",
            },
            {
              id: "quantitative",
              left: "الترتيب الكمي",
              right:
                "ترتيب البيانات وفقًا لطبيعتها أو قيمها الكمية.",
            },
            {
              id: "geographical",
              left: "الترتيب الجغرافي",
              right:
                "ترتيب البيانات وفقًا للموقع أو التوزيع الجغرافي.",
            },
          ],
        },
      },

      {
        lessonId: LESSON_IDS.lesson4,
        type: "INTERACTIVE",
        interactiveType: "DRAG_DROP",
        isSimplified: false,
        isSplitIntoParts: false,
        hasGraphics: true,
        variantOrder: 6,
        generatedByAI: false,
        data: {
          title: "صنّف أنواع الرسوم البيانية",
          instruction:
            "اسحب كل نوع من أنواع الرسوم البيانية إلى التصنيف المناسب.",
          categories: [
            {
              id: "graph-types",
              title: "أنواع الرسوم البيانية",
            },
            {
              id: "chart-examples",
              title:
                "أمثلة أنواع المخططات في معالج التخطيط",
            },
          ],
          items: [
            {
              id: "geographical",
              text: "المصورات الجغرافية",
              categoryId: "graph-types",
            },
            {
              id: "columns",
              text: "الأعمدة البيانية",
              categoryId: "graph-types",
            },
            {
              id: "circles-pyramids",
              text: "الدوائر والهرمات",
              categoryId: "graph-types",
            },
            {
              id: "curves",
              text: "المنحنيات الخطية البيانية",
              categoryId: "graph-types",
            },
            {
              id: "line",
              text: "الرسم الخطي",
              categoryId: "chart-examples",
            },
            {
              id: "pie",
              text: "الرسم الدائري Pie",
              categoryId: "chart-examples",
            },
            {
              id: "vertical",
              text: "الرسم العمودي",
              categoryId: "chart-examples",
            },
          ],
        },
      },

      {
        lessonId: LESSON_IDS.lesson4,
        type: "INTERACTIVE",
        interactiveType: "ORDERING",
        isSimplified: false,
        isSplitIntoParts: true,
        hasGraphics: false,
        variantOrder: 7,
        generatedByAI: false,
        data: {
          title: "رتّب خطوات إدراج معالج التخطيط",
          instruction:
            "رتّب الخطوات التالية بالترتيب الصحيح لإدراج مخطط بياني.",
          items: [
            {
              id: "open-word",
              text: "فتح برنامج Microsoft Word 2003.",
              correctOrder: 1,
            },
            {
              id: "insert-chart",
              text:
                "من قائمة إدراج اختيار التخطيط ثم برنامج معالج التخطيط.",
              correctOrder: 2,
            },
            {
              id: "data-sheet",
              text:
                "تظهر علبة التخطيط وورقة البيانات لإدخال المعلومات والقيم.",
              correctOrder: 3,
            },
            {
              id: "chart-type",
              text:
                "اختيار نوع الرسم البياني من رمز نوع الرسم الموجود في شريط القوائم.",
              correctOrder: 4,
            },
            {
              id: "value-lines",
              text:
                "تحديد العرض بخطوط القيم على كلمة التخطيط.",
              correctOrder: 5,
            },
            {
              id: "change-type",
              text:
                "يمكن تغيير نمط العرض من خلال المخطط واختيار تغيير نمط العرض أو Chart Type.",
              correctOrder: 6,
            },
          ],
        },
      },

      {
        lessonId: LESSON_IDS.lesson4,
        type: "INTERACTIVE",
        interactiveType: "TRUE_FALSE",
        isSimplified: false,
        isSplitIntoParts: true,
        hasGraphics: false,
        variantOrder: 8,
        generatedByAI: false,
        data: {
          title: "اختبر فهمك في عرض البيانات",
          instruction:
            "اقرأ العبارة وحدد هل هي صحيحة أم خاطئة وفقًا لمحتوى الدرس.",
          questions: [
            {
              id: "q1",
              statement:
                "يساعد عرض البيانات بصورة سهلة على استنتاج بعض النتائج الأولية منها.",
              correctAnswer: true,
              explanation:
                "يوضح الدرس أن تحويل البيانات وعرضها بصورة سهلة يساعد على استنتاج بعض النتائج الأولية.",
            },
            {
              id: "q2",
              statement:
                "العرض الجدولي يعتمد على ترتيب البيانات في صفوف وأعمدة.",
              correctAnswer: true,
              explanation:
                "العرض الجدولي هو ترتيب منظم للبيانات في صورة جداول ذات صفوف وأعمدة.",
            },
            {
              id: "q3",
              statement:
                "يمكن أن تكون الرسوم البيانية بديلًا كاملًا عن الجداول المالية والإحصائية.",
              correctAnswer: false,
              explanation:
                "يذكر الدرس أن الرسوم البيانية لا تكون بديلًا للجداول، وإنما يمكن أن تكون مكملة لها.",
            },
            {
              id: "q4",
              statement:
                "من أنواع الرسوم البيانية المذكورة المصورات الجغرافية والأعمدة والدوائر والهرمات والمنحنيات الخطية.",
              correctAnswer: true,
              explanation:
                "هذه هي الأنواع الرئيسية للرسوم البيانية المذكورة في الدرس.",
            },
            {
              id: "q5",
              statement:
                "يمكن تغيير نوع المخطط من خلال اختيار Chart Type ثم اختيار نوع الرسم المطلوب.",
              correctAnswer: true,
              explanation:
                "يوضح الدرس إمكانية تغيير نوع المخطط باستخدام Chart Type.",
            },
            {
              id: "q6",
              statement:
                "لحذف صف من ورقة البيانات يتم النقر على أحد الأرقام بزر الفأرة الأيمن ثم اختيار حذف.",
              correctAnswer: true,
              explanation:
                "هذه هي الطريقة المذكورة لحذف صف من ورقة البيانات.",
            },
            {
              id: "q7",
              statement:
                "لحذف عمود يتم النقر على أحد الأرقام الموجودة في ورقة البيانات.",
              correctAnswer: false,
              explanation:
                "لحذف العمود يتم النقر على أحد الحروف الموجودة في ورقة البيانات ثم اختيار حذف.",
            },
            {
              id: "q8",
              statement:
                "يمكن إخفاء أو إظهار ورقة البيانات من خلال النقر على المخطط بزر الماوس الأيمن واختيار ورقة بيانات.",
              correctAnswer: true,
              explanation:
                "هذه هي الطريقة المذكورة في الدرس لإخفاء أو إظهار ورقة البيانات.",
            },
          ],
        },
      },
    ],
  });

  console.log(
    "Successfully created 16 interactive lesson contents."
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

console.log("Successfully created 16 interactive lesson contents.");