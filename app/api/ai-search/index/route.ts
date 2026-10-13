
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { chunkText } from "@/lib/ai/chunk-text";
import { createEmbedding } from "@/lib/ai/embeddings";

type PreparedChunk = {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  content: string;
  chunkIndex: number;
  vector: string;
};

export const runtime = "nodejs";

// يسمح بوقت أطول لفهرسة الدروس في Next.js.
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const secret = process.env.RAG_INDEX_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Indexing secret is not configured" },
      { status: 500 },
    );
  }

  if (request.headers.get("x-rag-index-secret") !== secret) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        courseId: true,
        title: true,
        sourceContent: true,
      },
      orderBy: [
        { courseId: "asc" },
        { order: "asc" },
      ],
    });

    let indexedLessons = 0;
    let indexedChunks = 0;

    for (const lesson of lessons) {
      const chunks = chunkText(lesson.sourceContent);

      // 1. إنشاء جميع الـ embeddings خارج المعاملة.
      const preparedChunks: PreparedChunk[] = [];

      for (let i = 0; i < chunks.length; i++) {
        const content = chunks[i];

        const embedding = await createEmbedding(
          `${lesson.title}\n\n${content}`,
          "RETRIEVAL_DOCUMENT",
        );

        preparedChunks.push({
          id: randomUUID(),
          courseId: lesson.courseId,
          lessonId: lesson.id,
          title: lesson.title,
          content,
          chunkIndex: i,
          vector: `[${embedding.join(",")}]`,
        });
      }

      // 2. استبدال فهرسة هذا الدرس ذريًا.
      // لو فشل الإدخال، تُلغى المعاملة ويظل الفهرس القديم موجودًا.
      await prisma.$transaction(
        async (tx) => {
          await tx.$executeRaw`
            DELETE FROM "DocumentChunk"
            WHERE "lessonId" = ${lesson.id}
          `;

          for (const chunk of preparedChunks) {
            await tx.$executeRaw`
              INSERT INTO "DocumentChunk" (
                "id",
                "courseId",
                "lessonId",
                "title",
                "content",
                "chunkIndex",
                "embedding"
              )
              VALUES (
                ${chunk.id},
                ${chunk.courseId},
                ${chunk.lessonId},
                ${chunk.title},
                ${chunk.content},
                ${chunk.chunkIndex},
                ${chunk.vector}::vector
              )
            `;
          }
        },
        {
          maxWait: 10000,
          timeout: 30000,
        },
      );

      indexedLessons++;
      indexedChunks += preparedChunks.length;
    }

    return NextResponse.json({
      success: true,
      indexedLessons,
      indexedChunks,
    });
  } catch (error) {
    console.error("RAG indexing failed:", error);

    return NextResponse.json(
      { error: "Failed to index lesson content" },
      { status: 500 },
    );
  }
}
