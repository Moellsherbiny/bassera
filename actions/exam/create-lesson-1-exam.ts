"use server";

import { prisma } from "@/lib/prisma";
import {
  ExamType,
  QuestionDifficulty,
} from "@/generated/prisma/client";

const LESSON_ID = "cmtqz5z9r0006jcv755mknbwv";

const questions = [
  // ============================================================
  // EASY - 8
  // ============================================================

  {
    text: "ما الهدف الأساسي من نظم المعلومات داخل المنظمة؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      { text: "توفير المعلومات للمديرين ومتخذي القرار", isCorrect: true },
      { text: "إلغاء جميع الوظائف الإدارية", isCorrect: false },
      { text: "زيادة عدد المستندات الورقية", isCorrect: false },
      { text: "استبدال جميع العاملين بالحاسب", isCorrect: false },
    ],
  },
  {
    text: "إلى كم فئة رئيسية صُنفت نظم المعلومات حسب خدمتها للمستويات التنظيمية؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      { text: "فئتين", isCorrect: false },
      { text: "ثلاث فئات", isCorrect: true },
      { text: "أربع فئات", isCorrect: false },
      { text: "خمس فئات", isCorrect: false },
    ],
  },
  {
    text: "أي مستوى من المستويات التنظيمية يهتم بالتخطيط طويل الأجل؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      { text: "المستوى التشغيلي", isCorrect: false },
      { text: "مستوى الإدارة والمعرفة", isCorrect: false },
      { text: "المستوى الاستراتيجي", isCorrect: true },
      { text: "مستوى المستخدم الفردي", isCorrect: false },
    ],
  },
  {
    text: "أي نظام من الآتي يخدم المستوى التشغيلي في المنظمة؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      { text: "TPS", isCorrect: true },
      { text: "DSS", isCorrect: false },
      { text: "ESS", isCorrect: false },
      { text: "ES", isCorrect: false },
    ],
  },
  {
    text: "ما النظام الذي يخدم المستوى الإداري عن طريق التقارير الروتينية عن الأداء الحالي والتاريخي؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      { text: "TPS", isCorrect: false },
      { text: "MIS", isCorrect: true },
      { text: "DSS", isCorrect: false },
      { text: "ESS", isCorrect: false },
    ],
  },
  {
    text: "ما النظام الذي يساعد المديرين على اتخاذ القرارات الفريدة وتقديم مجموعة من البدائل؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      { text: "TPS", isCorrect: false },
      { text: "MIS", isCorrect: false },
      { text: "DSS", isCorrect: true },
      { text: "OAS", isCorrect: false },
    ],
  },
  {
    text: "أي من الآتي يُعد من مجالات نظم ميكنة الأعمال المكتبية؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      { text: "تنظيم وإدارة الوقت", isCorrect: true },
      { text: "إدارة المرور", isCorrect: false },
      { text: "تصنيع السيارات", isCorrect: false },
      { text: "الزراعة", isCorrect: false },
    ],
  },
  {
    text: "ما النظام المستخدم لإنتاج الوثائق النصية؟",
    difficulty: QuestionDifficulty.EASY,
    options: [
      { text: "نظم معالجة الكلمات", isCorrect: true },
      { text: "نظم الصور البيانية الإلكترونية", isCorrect: false },
      { text: "البريد الصوتي", isCorrect: false },
      { text: "نظم إدارة تنفيذ المشروعات", isCorrect: false },
    ],
  },

  // ============================================================
  // MEDIUM - 8
  // ============================================================

  {
    text: "أي نظام يعالج البيانات الناتجة عن مبادلات الأعمال اليومية الضرورية للمنظمة؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      { text: "نظم معالجة المعاملات TPS", isCorrect: true },
      { text: "نظم المعلومات الإدارية MIS", isCorrect: false },
      { text: "نظم دعم القرار DSS", isCorrect: false },
      { text: "نظم دعم الإدارة التنفيذية ESS", isCorrect: false },
    ],
  },
  {
    text: "ما الذي يميز نظم دعم القرار DSS عن نظم المعلومات الإدارية MIS وفقًا للمصدر؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      {
        text: "تركز على القرارات الفريدة وتوفر بدائل لمتخذ القرار",
        isCorrect: true,
      },
      {
        text: "تقتصر على التقارير الروتينية",
        isCorrect: false,
      },
      {
        text: "تعالج معاملات البيع اليومية فقط",
        isCorrect: false,
      },
      {
        text: "تستخدم فقط المعلومات الداخلية",
        isCorrect: false,
      },
    ],
  },
  {
    text: "على أي مستوى تعمل نظم دعم الإدارة التنفيذية ESS؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      { text: "المستوى التشغيلي", isCorrect: false },
      { text: "المستوى الإداري", isCorrect: false },
      { text: "المستوى الاستراتيجي", isCorrect: true },
      { text: "مستوى جماعة العمل المحدودة فقط", isCorrect: false },
    ],
  },
  {
    text: "أي من الآتي يُعد من النظم المستخدمة في مجال الاتصالات الإلكترونية؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      { text: "البريد الإلكتروني", isCorrect: true },
      { text: "الأجندة الإلكترونية", isCorrect: false },
      { text: "نظم معالجة الكلمات", isCorrect: false },
      { text: "نظم النشر المكتبي", isCorrect: false },
    ],
  },
  {
    text: "ما الأداة المستخدمة في تنظيم وجدولة أعمال الموظفين على مستوى جماعة المرؤوسين؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      { text: "الأجندة الإلكترونية", isCorrect: false },
      { text: "قائمة المهام TO DO List", isCorrect: true },
      { text: "البريد الإلكتروني", isCorrect: false },
      { text: "نظام معالجة الصور", isCorrect: false },
    ],
  },
  {
    text: "أي مستوى من مستويات تطبيق نظم ميكنة الأعمال المكتبية يعتمد على شبكة LAN بشكل أساسي؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      { text: "مستوى المستخدم الفردي", isCorrect: false },
      { text: "مستوى جماعة العمل المحدودة", isCorrect: true },
      { text: "مستوى المنظمة ككل", isCorrect: false },
      { text: "المستوى الاستراتيجي فقط", isCorrect: false },
    ],
  },
  {
    text: "ما أول مرحلة في تخطيط وتنفيذ عملية ميكنة الأعمال المكتبية؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      { text: "التصميم", isCorrect: false },
      { text: "التنفيذ", isCorrect: false },
      { text: "الدراسة والتحليل", isCorrect: true },
      { text: "التقييم", isCorrect: false },
    ],
  },
  {
    text: "أي من الآتي يُعد من عناصر مرحلة تنفيذ النظام؟",
    difficulty: QuestionDifficulty.MEDIUM,
    options: [
      { text: "اختبار النظام وتدريب العاملين", isCorrect: true },
      { text: "اختيار البدائل فقط", isCorrect: false },
      { text: "دراسة الوضع الحالي فقط", isCorrect: false },
      { text: "تحديد أسباب الحاجة للنظام فقط", isCorrect: false },
    ],
  },

  // ============================================================
  // HARD - 4
  // ============================================================

  {
    text: "إذا كانت المنظمة تحتاج إلى نظام يساعد الإدارة العليا في القرارات الاستراتيجية ويعتمد على معلومات داخلية ملخصة ومعلومات خارجية عن الاقتصاد والمنافسة، فما النظام الأنسب؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      { text: "TPS", isCorrect: false },
      { text: "MIS", isCorrect: false },
      { text: "DSS", isCorrect: false },
      { text: "ESS", isCorrect: true },
    ],
  },
  {
    text: "أي ترتيب يعبّر عن العلاقة الصحيحة بين مجالات ميكنة الأعمال المكتبية والأنظمة التابعة لها؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      {
        text: "إنتاج الوثائق المطبوعة ← معالجة الكلمات والنشر المكتبي",
        isCorrect: true,
      },
      {
        text: "الاتصالات الإلكترونية ← الأجندة الإلكترونية وقائمة المهام",
        isCorrect: false,
      },
      {
        text: "تنظيم الوقت ← معالجة الكلمات والنشر المكتبي",
        isCorrect: false,
      },
      {
        text: "معالجة الصور والرسومات ← البريد الإلكتروني والفاكسيميلي",
        isCorrect: false,
      },
    ],
  },
  {
    text: "في حالة الرغبة في ميكنة العمل المكتبي، لماذا يجب أن تسبق مرحلة التصميم مرحلة التنفيذ؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      {
        text: "لأن التصميم يعتمد على تحليل مفصل للنظام الحالي وتحديد الاحتياجات والمواصفات",
        isCorrect: true,
      },
      {
        text: "لأن التنفيذ لا يحتاج إلى اختبار النظام",
        isCorrect: false,
      },
      {
        text: "لأن مرحلة التنفيذ تحدد المشكلة لأول مرة",
        isCorrect: false,
      },
      {
        text: "لأن التصميم يقتصر على تدريب العاملين فقط",
        isCorrect: false,
      },
    ],
  },
  {
    text: "أي أسلوب للتحول يعني استمرار النظام القديم والنظام الجديد في العمل جنبًا إلى جنب بكل طاقتهما؟",
    difficulty: QuestionDifficulty.HARD,
    options: [
      { text: "المباشر", isCorrect: false },
      { text: "التوازي", isCorrect: true },
      { text: "التدريجي", isCorrect: false },
      { text: "التقييم", isCorrect: false },
    ],
  },
];

export async function createLesson1Exam() {
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
      message: "تم إنشاء امتحان الدرس الأول وبنك الأسئلة بنجاح.",
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
    console.error("createLesson1Exam error:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء امتحان الدرس.",
    };
  }
}