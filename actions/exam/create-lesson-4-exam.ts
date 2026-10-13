"use server";

import { prisma } from "@/lib/prisma";
import {
  ExamType,
  QuestionDifficulty,
} from "@/generated/prisma/client";

const LESSON_ID = "cmtqz5zez000cjcv71bcpwxt3";

const questions = [
  // ============================================================
  // EASY - 8
  // ============================================================

  {
    text: "لماذا يتم تحويل وعرض المعلومات المالية والإحصائية بصورة سهلة؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "لتمكيننا من استنتاج بعض النتائج الأولية منها",
        isCorrect: true,
      },
      {
        text: "لإلغاء الحاجة إلى جمع البيانات",
        isCorrect: false,
      },
      {
        text: "لتحويل البيانات إلى مستندات نصية فقط",
        isCorrect: false,
      },
      {
        text: "لمنع إجراء المقارنات بين البيانات",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما أهمية عرض البيانات بالنسبة للظاهرة محل الدراسة؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "توضيح حجم الظاهرة وإظهار العلاقات بين متغيراتها",
        isCorrect: true,
      },
      {
        text: "إخفاء العلاقات بين المتغيرات",
        isCorrect: false,
      },
      {
        text: "منع دراسة الظاهرة عبر الزمن",
        isCorrect: false,
      },
      {
        text: "زيادة حجم البيانات دون تنظيمها",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما المقصود بالعرض الجدولي للبيانات؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "ترتيب منظم للبيانات في صورة جداول ذات صفوف وأعمدة",
        isCorrect: true,
      },
      {
        text: "عرض البيانات في صورة رسوم فقط",
        isCorrect: false,
      },
      {
        text: "عرض البيانات باستخدام الخرائط فقط",
        isCorrect: false,
      },
      {
        text: "حذف البيانات غير المهمة",
        isCorrect: false,
      },
    ],
  },

  {
    text: "أي من الآتي يُعد من طرق ترتيب البيانات في الجداول؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "الترتيب التاريخي",
        isCorrect: true,
      },
      {
        text: "الترتيب العشوائي",
        isCorrect: false,
      },
      {
        text: "الترتيب الصوتي",
        isCorrect: false,
      },
      {
        text: "الترتيب المرئي فقط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما أول شيء يجب إعطاؤه لكل جدول عند إعداده؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "عنوان",
        isCorrect: true,
      },
      {
        text: "رسم بياني",
        isCorrect: false,
      },
      {
        text: "صورة",
        isCorrect: false,
      },
      {
        text: "رابط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما المقصود بالعرض البياني للبيانات؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "عرض البيانات الإحصائية في صورة رسوم وأشكال بيانية",
        isCorrect: true,
      },
      {
        text: "ترتيب البيانات في صفوف وأعمدة فقط",
        isCorrect: false,
      },
      {
        text: "حذف البيانات الإحصائية",
        isCorrect: false,
      },
      {
        text: "تحويل البيانات إلى نصوص فقط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "أي من الآتي يُعد نوعًا رئيسيًا من أنواع الرسوم البيانية المذكورة في المصدر؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "الأعمدة البيانية",
        isCorrect: true,
      },
      {
        text: "الجداول الزمنية",
        isCorrect: false,
      },
      {
        text: "النصوص التوضيحية",
        isCorrect: false,
      },
      {
        text: "القوائم النصية",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما البرنامج المستخدم في خطوات إدراج معالج التخطيط المذكورة في المصدر؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "Microsoft Word 2003",
        isCorrect: true,
      },
      {
        text: "Microsoft Publisher 2003",
        isCorrect: false,
      },
      {
        text: "Microsoft Excel 2003",
        isCorrect: false,
      },
      {
        text: "Microsoft Access 2003",
        isCorrect: false,
      },
    ],
  },

  // ============================================================
  // MEDIUM - 8
  // ============================================================

  {
    text: "كيف يساعد عرض البيانات في دراسة تطور الظاهرة؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "يسمح بدراسة تطور الظاهرة عبر الزمن وإجراء المقارنات",
        isCorrect: true,
      },
      {
        text: "يمنع مقارنة الظاهرة بالظواهر المماثلة",
        isCorrect: false,
      },
      {
        text: "يحول الظاهرة إلى بيانات غير منظمة",
        isCorrect: false,
      },
      {
        text: "يلغي الحاجة إلى تحليل الظاهرة",
        isCorrect: false,
      },
    ],
  },

  {
    text: "على ماذا يعتمد اختيار طريقة ترتيب البيانات داخل الجدول؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "على طبيعة البيانات والهدف من عرضها",
        isCorrect: true,
      },
      {
        text: "على حجم شاشة الحاسب فقط",
        isCorrect: false,
      },
      {
        text: "على نوع الطابعة فقط",
        isCorrect: false,
      },
      {
        text: "على عدد الرسوم البيانية فقط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "أي مجموعة تمثل طرق ترتيب البيانات المذكورة في المصدر؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "التاريخي والأبجدي والكمي والجغرافي",
        isCorrect: true,
      },
      {
        text: "الصوتي والمرئي والرقمي واليدوي",
        isCorrect: false,
      },
      {
        text: "العشوائي والزمني والصوتي والمرئي",
        isCorrect: false,
      },
      {
        text: "النصي والصوتي والفيديو والصوري",
        isCorrect: false,
      },
    ],
  },

  {
    text: "أي من الآتي يجب أن يوضحه الباحث عند إعداد الجدول؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "الوحدات المستخدمة في البيانات",
        isCorrect: true,
      },
      {
        text: "نوع نظام التشغيل فقط",
        isCorrect: false,
      },
      {
        text: "نوع الطابعة المستخدمة",
        isCorrect: false,
      },
      {
        text: "اسم برنامج الرسم فقط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "لماذا يفضل أن يكون الجدول بسيطًا وواضحًا؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "لتسهيل فهم البيانات والمقارنة بينها",
        isCorrect: true,
      },
      {
        text: "لزيادة تعقيد البيانات",
        isCorrect: false,
      },
      {
        text: "لإخفاء الوحدات المستخدمة",
        isCorrect: false,
      },
      {
        text: "لمنع قراءة الجدول",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما العلاقة بين الرسوم البيانية والجداول المالية أو الإحصائية؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "الرسوم البيانية لا تعد بديلًا للجداول وإنما يمكن أن تكون مكملة لها",
        isCorrect: true,
      },
      {
        text: "الرسوم البيانية تلغي الجداول تمامًا",
        isCorrect: false,
      },
      {
        text: "الجداول لا يمكن استخدامها مع الرسوم",
        isCorrect: false,
      },
      {
        text: "الرسوم البيانية تستخدم فقط للبيانات غير الإحصائية",
        isCorrect: false,
      },
    ],
  },

  {
    text: "بعد فتح Microsoft Word 2003، ما المسار المستخدم لإدراج التخطيط وفقًا للمصدر؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "من قائمة إدراج نختار التخطيط ثم معالج التخطيط",
        isCorrect: true,
      },
      {
        text: "من قائمة ملف نختار حفظ ثم التخطيط",
        isCorrect: false,
      },
      {
        text: "من قائمة تحرير نختار حذف ثم التخطيط",
        isCorrect: false,
      },
      {
        text: "من قائمة عرض نختار الطباعة ثم التخطيط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما وظيفة العمود الأول الرئيسي في ورقة البيانات الخاصة بالرسم البياني؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "يمثل أسماء السلاسل",
        isCorrect: true,
      },
      {
        text: "يمثل عناوين المستند فقط",
        isCorrect: false,
      },
      {
        text: "يمثل وحدات القياس فقط",
        isCorrect: false,
      },
      {
        text: "يمثل نوع الطابعة",
        isCorrect: false,
      },
    ],
  },

  // ============================================================
  // HARD - 4
  // ============================================================

  {
    text: "باحث يريد عرض بيانات تسمح له بفهم حجم ظاهرة معينة، ودراسة علاقتها بمتغيرات أخرى، ومتابعة تطورها عبر الزمن، ثم مقارنتها بظواهر مماثلة. ما الفائدة الأساسية لعرض البيانات التي يحققها ذلك؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      {
        text: "تسهيل تحليل ودراسة الظاهرة واستخلاص النتائج منها",
        isCorrect: true,
      },
      {
        text: "منع إجراء المقارنات بين الظواهر",
        isCorrect: false,
      },
      {
        text: "تحويل البيانات إلى بيانات غير منظمة",
        isCorrect: false,
      },
      {
        text: "إلغاء الحاجة إلى دراسة المتغيرات",
        isCorrect: false,
      },
    ],
  },

  {
    text: "إذا كان الهدف من عرض البيانات هو توضيح ترتيب مجموعة من القيم حسب كمياتها، فأي طريقة ترتيب وردت في المصدر يمكن استخدامها؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      {
        text: "الترتيب الكمي",
        isCorrect: true,
      },
      {
        text: "الترتيب الأبجدي",
        isCorrect: false,
      },
      {
        text: "الترتيب الجغرافي",
        isCorrect: false,
      },
      {
        text: "الترتيب التاريخي",
        isCorrect: false,
      },
    ],
  },

  {
    text: "أدخل المستخدم بيانات الرسم البياني، ويريد تغيير نوع الرسم من رسم عمودي إلى رسم دائري. ما الإجراء المناسب وفقًا للمصدر؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      {
        text: "اختيار Chart Type ثم اختيار نوع الرسم المطلوب",
        isCorrect: true,
      },
      {
        text: "حذف ورقة البيانات بالكامل",
        isCorrect: false,
      },
      {
        text: "تغيير اسم الملف فقط",
        isCorrect: false,
      },
      {
        text: "حذف الصف الأول من ورقة البيانات",
        isCorrect: false,
      },
    ],
  },

  {
    text: "يريد المستخدم حذف خلية محددة من ورقة البيانات دون حذف الصف أو العمود بالكامل. ما الإجراء الصحيح؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      {
        text: "النقر داخل الخلية بزر الفأرة الأيمن ثم اختيار حذف وتحديد جهة إزالة الخلايا",
        isCorrect: true,
      },
      {
        text: "النقر على حرف العمود ثم اختيار حذف",
        isCorrect: false,
      },
      {
        text: "النقر على رقم الصف ثم اختيار حذف",
        isCorrect: false,
      },
      {
        text: "تغيير نوع المخطط من Chart Type",
        isCorrect: false,
      },
    ],
  },
];

export async function createLesson4Exam() {
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
      message: "تم إنشاء امتحان الدرس الرابع وبنك الأسئلة بنجاح.",
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
    console.error("createLesson4Exam error:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء امتحان الدرس.",
    };
  }
}