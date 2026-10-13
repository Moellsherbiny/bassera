"use server";

import { prisma } from "@/lib/prisma";
import {
  ExamType,
  QuestionDifficulty,
} from "@/generated/prisma/client";

const LESSON_ID = "cmtqz5zd2000ajcv75mqkod3f";

const questions = [
  // ============================================================
  // EASY - 8
  // ============================================================

  {
    text: "ما المقصود بالنشر المكتبي DTP وفقًا للمصدر؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "نظام إنتاج طباعي قليل الكلفة يجمع بين النصوص والمخططات والرسومات والأشكال باستخدام الحاسب والبرمجيات المتخصصة",
        isCorrect: true,
      },
      {
        text: "نظام يستخدم فقط لتخزين الملفات",
        isCorrect: false,
      },
      {
        text: "نظام مخصص لإرسال البريد الإلكتروني فقط",
        isCorrect: false,
      },
      {
        text: "برنامج يستخدم فقط لمعالجة الجداول الحسابية",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما الذي ساعد على زيادة قوة عملية النشر المكتبي مع ظهور الحاسبات؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "استخدام البرمجيات لإنتاج تصاميم الصفحة وتحسن أجهزة وشاشات العرض",
        isCorrect: true,
      },
      {
        text: "إلغاء استخدام الطابعات",
        isCorrect: false,
      },
      {
        text: "الاعتماد على المستندات الورقية فقط",
        isCorrect: false,
      },
      {
        text: "استخدام أجهزة الهاتف فقط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما أحد أنواع الطابعات التي ساهمت في تطور النشر المكتبي؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "Inkjet",
        isCorrect: true,
      },
      {
        text: "الماسح الضوئي",
        isCorrect: false,
      },
      {
        text: "الفاكس",
        isCorrect: false,
      },
      {
        text: "لوحة المفاتيح",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما البرنامج المذكور في المصدر كبرنامج للنشر المكتبي؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "Microsoft Office Publisher 2003",
        isCorrect: true,
      },
      {
        text: "Microsoft Excel 2003",
        isCorrect: false,
      },
      {
        text: "Microsoft Access 2003",
        isCorrect: false,
      },
      {
        text: "Microsoft PowerPoint 2003",
        isCorrect: false,
      },
    ],
  },

  {
    text: "إلى أي حزمة برامج ينتمي Microsoft Publisher 2003؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "Microsoft Office",
        isCorrect: true,
      },
      {
        text: "Windows فقط",
        isCorrect: false,
      },
      {
        text: "Internet Explorer",
        isCorrect: false,
      },
      {
        text: "Adobe Office",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما العنصر الذي يتضمن اسم البرنامج وأزرار التكبير والتصغير والخروج؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "شريط العنوان",
        isCorrect: true,
      },
      {
        text: "شريط القوائم",
        isCorrect: false,
      },
      {
        text: "جزء المهام",
        isCorrect: false,
      },
      {
        text: "قائمة المنشورات",
        isCorrect: false,
      },
    ],
  },

  {
    text: "كم مجموعة تصميم رئيسية يمكن الاختيار من بينها في Publisher 2003 وفقًا للمصدر؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "45 مجموعة",
        isCorrect: true,
      },
      {
        text: "15 مجموعة",
        isCorrect: false,
      },
      {
        text: "25 مجموعة",
        isCorrect: false,
      },
      {
        text: "80 مجموعة",
        isCorrect: false,
      },
    ],
  },

  {
    text: "كم صفحة يتكون منها الكتالوج المعرفة بالجهاز افتراضيًا وفقًا للمصدر؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "8 صفحات",
        isCorrect: true,
      },
      {
        text: "4 صفحات",
        isCorrect: false,
      },
      {
        text: "6 صفحات",
        isCorrect: false,
      },
      {
        text: "10 صفحات",
        isCorrect: false,
      },
    ],
  },

  // ============================================================
  // MEDIUM - 8
  // ============================================================

  {
    text: "ما الفرق الأساسي بين برامج معالجة النصوص وبرامج النشر المكتبي وفقًا للمصدر؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "معالجة النصوص تؤكد على إنجاز النص، بينما النشر المكتبي يؤكد على التصميم والمظهر المرئي للوثيقة",
        isCorrect: true,
      },
      {
        text: "معالجة النصوص تستخدم للصور فقط، والنشر المكتبي للنصوص فقط",
        isCorrect: false,
      },
      {
        text: "النشر المكتبي لا يسمح بإدراج الرسومات",
        isCorrect: false,
      },
      {
        text: "لا يوجد فرق بينهما في طبيعة الاستخدام",
        isCorrect: false,
      },
    ],
  },

  {
    text: "لماذا أصبح من الممكن لعامل المكتب إنتاج وثائق كثيرة داخل المؤسسة باستخدام النشر المكتبي؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "لأن مجموعة التقنيات والبرمجيات والطابعات أتاحت إنتاج الوثائق داخل المكتب بدل إرسالها لشركة الطباعة",
        isCorrect: true,
      },
      {
        text: "لأن النشر المكتبي ألغى الحاجة إلى الحاسب",
        isCorrect: false,
      },
      {
        text: "لأن جميع الوثائق أصبحت إلكترونية فقط",
        isCorrect: false,
      },
      {
        text: "لأن الطباعة لم تعد مطلوبة",
        isCorrect: false,
      },
    ],
  },

  {
    text: "أي نوع من الوثائق يستخدم فيه النشر المكتبي عمومًا وفقًا للمصدر؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "الوثائق القصيرة مثل الإعلانات والكتيبات والتقارير",
        isCorrect: true,
      },
      {
        text: "قواعد البيانات فقط",
        isCorrect: false,
      },
      {
        text: "الرسائل الصوتية فقط",
        isCorrect: false,
      },
      {
        text: "البرامج الحاسوبية فقط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "أي من الآتي يُعد من خيارات جزء المهام في المنشور الجديد؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "منشورات الطباعة ومواقع الويب والبريد الإلكتروني والمنشورات الفارغة",
        isCorrect: true,
      },
      {
        text: "إدارة قواعد البيانات فقط",
        isCorrect: false,
      },
      {
        text: "إدارة الشبكات فقط",
        isCorrect: false,
      },
      {
        text: "تحرير ملفات الصوت فقط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما وظيفة قائمة المنشورات في نافذة Microsoft Publisher؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "عرض محتويات البند المحدد من بنود المنشور الجديد",
        isCorrect: true,
      },
      {
        text: "إغلاق البرنامج",
        isCorrect: false,
      },
      {
        text: "تغيير نظام التشغيل",
        isCorrect: false,
      },
      {
        text: "تشغيل الطابعة فقط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "أي من الآتي يُعد من أنواع منشورات البريد الإلكتروني الموجودة في Publisher 2003؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "رسالة إخبارية",
        isCorrect: true,
      },
      {
        text: "قاعدة بيانات",
        isCorrect: false,
      },
      {
        text: "جدول حسابي",
        isCorrect: false,
      },
      {
        text: "عرض تقديمي",
        isCorrect: false,
      },
    ],
  },

  {
    text: "عند إنشاء دعوة في Publisher 2003، من أي قسم يتم اختيار بطاقة الدعوة؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "منشورات للطباعة",
        isCorrect: true,
      },
      {
        text: "مواقع الويب",
        isCorrect: false,
      },
      {
        text: "البريد الإلكتروني",
        isCorrect: false,
      },
      {
        text: "المنشورات المحفوظة",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما الخطوة التي تتيح تغيير عدد صفحات الكتالوج عن العدد الافتراضي؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "النقر على إحدى الصفحات من شريط قائمة الصفحات واختيار العدد المطلوب من القائمة المنسدلة",
        isCorrect: true,
      },
      {
        text: "إغلاق البرنامج وإعادة تشغيله",
        isCorrect: false,
      },
      {
        text: "تغيير اسم الملف فقط",
        isCorrect: false,
      },
      {
        text: "استخدام شريط العنوان",
        isCorrect: false,
      },
    ],
  },

  // ============================================================
  // HARD - 4
  // ============================================================

  {
    text: "يريد موظف إنتاج إعلان قصير يجمع بين النصوص والصور والرسومات ويهتم بشكل أساسي بالمظهر النهائي للوثيقة. أي نوع من البرامج يناسب هذا الاستخدام وفقًا للمصدر؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      {
        text: "برنامج النشر المكتبي DTP",
        isCorrect: true,
      },
      {
        text: "نظام معالجة النصوص التقليدي فقط",
        isCorrect: false,
      },
      {
        text: "برنامج إدارة قواعد البيانات",
        isCorrect: false,
      },
      {
        text: "برنامج الاتصالات الإلكترونية",
        isCorrect: false,
      },
    ],
  },

  {
    text: "أي ترتيب يمثل خطوات إنشاء دعوة للاحتفال بالتخرج في Publisher 2003 بصورة صحيحة؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      {
        text: "فتح Publisher ← منشور جديد ← ملف/جديد ← منشورات للطباعة ← بطاقة دعوة ← احتفال تخرج ← اختيار التنسيقات والبيانات ← الحفظ",
        isCorrect: true,
      },
      {
        text: "فتح Publisher ← مواقع الويب ← كتالوجات ← حفظ ← بطاقة دعوة",
        isCorrect: false,
      },
      {
        text: "فتح Publisher ← البريد الإلكتروني ← رسالة إخبارية ← بطاقة دعوة ← حفظ",
        isCorrect: false,
      },
      {
        text: "فتح Publisher ← منشور فارغ فقط ← طباعة مباشرة دون اختيار تصميم",
        isCorrect: false,
      },
    ],
  },

  {
    text: "يريد مستخدم إنشاء منشور دون الاعتماد على تصميم جاهز، فما الخيار الذي يوفره جزء المهام وفقًا للمصدر؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      {
        text: "تصميم الصفحات بنفسه من خلال منشور طباعة عادية أو صفحة ويب فارغة",
        isCorrect: true,
      },
      {
        text: "اختيار منشور محفوظ فقط",
        isCorrect: false,
      },
      {
        text: "اختيار البريد الصوتي",
        isCorrect: false,
      },
      {
        text: "اختيار قائمة المنشورات فقط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "إذا أراد المستخدم إنشاء كتالوج لموضوع معين ثم تعديل عدد صفحاته بعد اختيار التصميم، فما الإجراء الصحيح وفقًا للمصدر؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      {
        text: "اختيار منشور جديد ثم منشورات للطباعة ثم كتالوجات ثم اختيار الموضوع والتصميم، وبعد ذلك تعديل الصفحات من شريط قائمة الصفحات",
        isCorrect: true,
      },
      {
        text: "اختيار بطاقة دعوة ثم تغيير شريط العنوان",
        isCorrect: false,
      },
      {
        text: "اختيار منشور بريد إلكتروني ثم تعديل عدد صفحات الرسالة",
        isCorrect: false,
      },
      {
        text: "اختيار صفحة ويب فارغة ثم تشغيل الطابعة",
        isCorrect: false,
      },
    ],
  },
];

export async function createLesson3Exam() {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: LESSON_ID,
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!lesson) {
      return {
        success: false,
        message: "الدرس غير موجود.",
      };
    }

    const existingExam = await prisma.exam.findFirst({
      where: {
        lessonId: LESSON_ID,
        type: ExamType.LESSON_QUIZ,
      },
      select: {
        id: true,
      },
    });

    if (existingExam) {
      return {
        success: false,
        message: "امتحان هذا الدرس موجود بالفعل.",
        examId: existingExam.id,
      };
    }

    const exam = await prisma.$transaction(async (tx) => {
      const createdExam = await tx.exam.create({
        data: {
          type: ExamType.LESSON_QUIZ,
          lessonId: LESSON_ID,
          passingScore: 50,
        },
        select: {
          id: true,
          type: true,
          lessonId: true,
          passingScore: true,
        },
      });

      for (const question of questions) {
        await tx.question.create({
          data: {
            lessonId: LESSON_ID,
            text: question.text,
            difficulty: question.difficulty,
            generatedByAI: false,
            options: {
              create: question.options,
            },
          },
        });
      }

      return createdExam;
    });

    return {
      success: true,
      message: "تم إنشاء امتحان الدرس الثالث وبنك الأسئلة بنجاح.",
      exam,
      questionsCount: questions.length,
      distribution: {
        easy: questions.filter(
          (q) => q.difficulty === QuestionDifficulty.EASY,
        ).length,
        medium: questions.filter(
          (q) => q.difficulty === QuestionDifficulty.MEDIUM,
        ).length,
        hard: questions.filter(
          (q) => q.difficulty === QuestionDifficulty.HARD,
        ).length,
      },
    };
  } catch (error) {
    console.error("createLesson3Exam error:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء امتحان الدرس.",
    };
  }
}