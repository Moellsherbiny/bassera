"use server";

import { prisma } from "@/lib/prisma";
import {
  ExamType,
  QuestionDifficulty,
} from "@/generated/prisma/client";

const LESSON_ID = "cmtqz5zbo0008jcv76kanj5bn";

const questions = [
  // ============================================================
  // EASY - 8
  // ============================================================

  {
    text: "ما المقصود بنظم معالجة الكلمات؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "برامج تسمح بكتابة النص وتخزينه وتنسيقه وتعديله وطباعته",
        isCorrect: true,
      },
      {
        text: "برامج تستخدم فقط لإنشاء الرسومات",
        isCorrect: false,
      },
      {
        text: "أجهزة تستخدم فقط لإرسال البريد الإلكتروني",
        isCorrect: false,
      },
      {
        text: "أنظمة تستخدم فقط لإدارة قواعد البيانات",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما أحد أهم المجالات التي تتبع نظم ميكنة الأعمال المكتبية في مجال إنتاج الوثائق المطبوعة؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "نظم معالجة الكلمات",
        isCorrect: true,
      },
      {
        text: "نظم إدارة المشروعات",
        isCorrect: false,
      },
      {
        text: "نظم الاتصالات الإلكترونية",
        isCorrect: false,
      },
      {
        text: "النظم الخبيرة",
        isCorrect: false,
      },
    ],
  },

  {
    text: "من هو العالم البريطاني الذي طرح فكرة وجود آلة ميكانيكية يمكنها طباعة الحروف على الورق عام 1714؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "هنري ميل",
        isCorrect: true,
      },
      {
        text: "وليام أوستن",
        isCorrect: false,
      },
      {
        text: "بيلجرمو توري",
        isCorrect: false,
      },
      {
        text: "توماس إديسون",
        isCorrect: false,
      },
    ],
  },

  {
    text: "في أي عام قام بيلجرمو توري باختراع الآلة الكاتبة وفقًا للمصدر؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "1714",
        isCorrect: false,
      },
      {
        text: "1808",
        isCorrect: true,
      },
      {
        text: "1829",
        isCorrect: false,
      },
      {
        text: "1961",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما أحد أمثلة برامج معالجة الكلمات الحديثة المذكورة في المصدر؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "MS Word",
        isCorrect: true,
      },
      {
        text: "PowerPoint فقط",
        isCorrect: false,
      },
      {
        text: "Paint فقط",
        isCorrect: false,
      },
      {
        text: "Calculator",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما الجهاز الذي يستخدم لاستخراج الوثائق من الحاسب في نظم معالجة الكلمات الحديثة؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "الطابعة",
        isCorrect: true,
      },
      {
        text: "الماسح الضوئي",
        isCorrect: false,
      },
      {
        text: "لوحة المفاتيح",
        isCorrect: false,
      },
      {
        text: "الفاكس فقط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما الأداة التي تقارن الكلمات المكتوبة بكلمات مخزنة مسبقًا في قاموس أو قاعدة بيانات؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "المدقق الإملائي",
        isCorrect: true,
      },
      {
        text: "المدقق النحوي",
        isCorrect: false,
      },
      {
        text: "الماكرو",
        isCorrect: false,
      },
      {
        text: "القالب",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما الذي يقوم به المدقق النحوي؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      {
        text: "مطابقة الجمل مع قواعد اللغة المعروفة",
        isCorrect: true,
      },
      {
        text: "طباعة المستند فقط",
        isCorrect: false,
      },
      {
        text: "إدراج الصور داخل المستند",
        isCorrect: false,
      },
      {
        text: "تغيير حجم الورق فقط",
        isCorrect: false,
      },
    ],
  },

  // ============================================================
  // MEDIUM - 8
  // ============================================================

  {
    text: "ما السبب الرئيسي لبقاء النظم التقليدية لمعالجة الكلمات فترة من الوقت رغم ظهور النظم الحديثة؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "كانت ذات إمكانيات عالية في معالجة الكلمات",
        isCorrect: true,
      },
      {
        text: "كانت تؤدي عدة وظائف مختلفة في الوقت نفسه",
        isCorrect: false,
      },
      {
        text: "كانت تعتمد على الإنترنت",
        isCorrect: false,
      },
      {
        text: "كانت تستخدم قواعد بيانات خارجية",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما أهم عيبين للنظم التقليدية لمعالجة الكلمات المذكورين في المصدر؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "صعوبة التعديل والتحديث، وأداء وظيفة واحدة فقط",
        isCorrect: true,
      },
      {
        text: "بطء الإنترنت وعدم وجود طابعة",
        isCorrect: false,
      },
      {
        text: "عدم إمكانية كتابة النصوص وعدم وجود شاشة",
        isCorrect: false,
      },
      {
        text: "ارتفاع جودة الطباعة وعدم وجود برامج",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما العناصر الأساسية التي ينبغي توفرها لتطبيق نظم معالجة الكلمات الحديثة في المكتب؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "حاسب شخصي متعدد الأغراض، برنامج لمعالجة الكلمات، وطابعة",
        isCorrect: true,
      },
      {
        text: "طابعة فقط وماسح ضوئي",
        isCorrect: false,
      },
      {
        text: "حاسب مركزي فقط",
        isCorrect: false,
      },
      {
        text: "هاتف وشبكة إنترنت فقط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما الذي يميز الحاسب الشخصي متعدد الأغراض في نظم معالجة الكلمات الحديثة؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "يمكن استخدامه لأكثر من وظيفة باستخدام التطبيق المناسب",
        isCorrect: true,
      },
      {
        text: "يستخدم فقط لمعالجة الكلمات",
        isCorrect: false,
      },
      {
        text: "يستخدم فقط لطباعة الوثائق",
        isCorrect: false,
      },
      {
        text: "لا يمكن تغيير التطبيقات الموجودة عليه",
        isCorrect: false,
      },
    ],
  },

  {
    text: "أي من الآتي يمكن تنفيذه باستخدام برامج معالجة الكلمات الحديثة وفقًا للمصدر؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "إدراج الصور والجداول والرسوم البيانية وتنسيق النص",
        isCorrect: true,
      },
      {
        text: "إجراء الاتصالات الهاتفية فقط",
        isCorrect: false,
      },
      {
        text: "تشغيل الطابعة دون إنشاء مستندات",
        isCorrect: false,
      },
      {
        text: "إدارة الشبكات فقط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "أي وظيفة تسمح للمستخدم بالعثور على نص معين واستبداله داخل المستند؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "البحث والاستبدال",
        isCorrect: true,
      },
      {
        text: "المعاينة قبل الطباعة",
        isCorrect: false,
      },
      {
        text: "القوالب",
        isCorrect: false,
      },
      {
        text: "شريط الحالة",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ما وظيفة Macro في برامج معالجة الكلمات؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "تسجيل مجموعة من الأوامر وتنفيذها مباشرة عند الحاجة",
        isCorrect: true,
      },
      {
        text: "فحص الأخطاء الإملائية فقط",
        isCorrect: false,
      },
      {
        text: "إدراج صورة داخل المستند",
        isCorrect: false,
      },
      {
        text: "تغيير حجم الورق تلقائيًا",
        isCorrect: false,
      },
    ],
  },

  {
    text: "ماذا يفعل المدقق الإملائي عندما لا تتطابق الكلمة المدخلة مع الكلمات الموجودة في القاموس؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "يقترح بعض الكلمات البديلة",
        isCorrect: true,
      },
      {
        text: "يحذف المستند بالكامل",
        isCorrect: false,
      },
      {
        text: "يغير لغة المستند تلقائيًا",
        isCorrect: false,
      },
      {
        text: "يطبع المستند مباشرة",
        isCorrect: false,
      },
    ],
  },

  // ============================================================
  // HARD - 4
  // ============================================================

  {
    text: "أي موقف يوضح الفرق الأساسي بين النظم التقليدية والنظم الحديثة لمعالجة الكلمات؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      {
        text: "النظام الحديث يسمح بتعديل النص وإعادة ترتيبه وتنسيقه وإدراج الصور والجداول والرسوم البيانية دون إعادة كتابة الوثيقة بالكامل",
        isCorrect: true,
      },
      {
        text: "النظام التقليدي يسمح باستخدام عدة تطبيقات على نفس الجهاز",
        isCorrect: false,
      },
      {
        text: "النظام الحديث يؤدي وظيفة معالجة الكلمات فقط",
        isCorrect: false,
      },
      {
        text: "النظام التقليدي يعتمد على الحاسب الشخصي متعدد الأغراض",
        isCorrect: false,
      },
    ],
  },

  {
    text: "أي مجموعة من الوظائف تعبر بشكل أفضل عن قدرات برامج معالجة الكلمات الحديثة؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      {
        text: "إدراج الجداول والصور والرسوم، البحث والاستبدال، حماية المستند، الطباعة والمعاينة",
        isCorrect: true,
      },
      {
        text: "كتابة النص فقط دون إمكانية تعديله",
        isCorrect: false,
      },
      {
        text: "طباعة المستند فقط دون تخزينه",
        isCorrect: false,
      },
      {
        text: "فحص الأخطاء النحوية فقط",
        isCorrect: false,
      },
    ],
  },

  {
    text: "طالب كتب جملة صحيحة إملائيًا لكنها لا تتوافق مع قواعد اللغة. أي أداة يفترض أن تساعده وفقًا للمصدر؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      {
        text: "المدقق النحوي",
        isCorrect: true,
      },
      {
        text: "المدقق الإملائي",
        isCorrect: false,
      },
      {
        text: "Macro",
        isCorrect: false,
      },
      {
        text: "القالب Template",
        isCorrect: false,
      },
    ],
  },

  {
    text: "يريد موظف تنفيذ مجموعة طويلة من الأوامر المتكررة بنفس الترتيب كل مرة. ما الإمكانية الأنسب لتوفير الوقت والجهد؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      {
        text: "Macro",
        isCorrect: true,
      },
      {
        text: "البحث والاستبدال",
        isCorrect: false,
      },
      {
        text: "المعاينة قبل الطباعة",
        isCorrect: false,
      },
      {
        text: "التدقيق الإملائي",
        isCorrect: false,
      },
    ],
  },
];

export async function createLesson2Exam() {
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
      message: "تم إنشاء امتحان الدرس الثاني وبنك الأسئلة بنجاح.",
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
    console.error("createLesson2Exam error:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء امتحان الدرس الثاني.",
    };
  }
}