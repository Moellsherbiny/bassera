"use client";

import { LockedLesson } from "./render-lesson/locked-lesson";
import { OpenLesson } from "./render-lesson/open-lesson";
import { LessonClientProps } from "@/types/lessons";

export function LessonClient(props: LessonClientProps) {
  if (props.locked) {
    return <LockedLesson data={props.lockedData} />;
  }

  return <OpenLesson data={props.data} />;
}
