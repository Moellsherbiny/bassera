"use client";

import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  InputGroup,
  Label,
  Switch,
  TextField,
} from "@heroui/react";

import {
  Person,
  Envelope,
  Smartphone,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Target,
  Picture,
  FloppyDisk,
} from "@gravity-ui/icons";

type ProfileUser = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  role: "STUDENT" | "TEACHER" | "ADMIN";

  studentProfile: {
    preferSimplified: boolean;
    preferSplitIntoParts: boolean;
    preferGraphics: boolean;
    overallAverageScore: number;
    totalAttempts: number;
    strugglingFlag: boolean;
  } | null;
  isVerified: boolean;

};

type Props = {
  user: ProfileUser;
};

const roleLabels: Record<ProfileUser["role"], string> = {
  STUDENT: "طالب",
  TEACHER: "معلم",
  ADMIN: "مدير",
};

export default function ProfileClient({ user }: Props) {
  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");

  const [preferSimplified, setPreferSimplified] = useState(
    user.studentProfile?.preferSimplified ?? false,
  );
  const [preferSplitIntoParts, setPreferSplitIntoParts] = useState(
    user.studentProfile?.preferSplitIntoParts ?? false,
  );
  const [preferGraphics, setPreferGraphics] = useState(
    user.studentProfile?.preferGraphics ?? true,
  );

  const profile = user.studentProfile;
  const isStudent = user.role === "STUDENT";

  const initials =
    user.name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div dir="rtl" className="mx-auto w-full max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 text-base">
            {user.image ? (
              <Avatar.Image src={user.image} alt={user.name ?? "صورة المستخدم"} />
            ) : null}
            <Avatar.Fallback>{initials}</Avatar.Fallback>
          </Avatar>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">
                {user.name || "مستخدم"}
              </h1>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {roleLabels[user.role]}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-default-500">
              <span className="flex items-center gap-1.5">
                <Envelope className="h-3.5 w-3.5" />
                {user.email}
              </span>
              <span
                className={`flex items-center gap-1.5 ${
                  user.isVerified ? "text-success-600" : "text-default-400"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {user.isVerified ? "بريد موثّق" : "بريد غير موثّق"}
              </span>
            </div>
          </div>
        </div>

        {isStudent && profile ? (
          <ScoreSummary score={profile.overallAverageScore} attempts={profile.totalAttempts} />
        ) : null}
      </div>

      {profile?.strugglingFlag ? (
        <div className="rounded-2xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-700">
          يقترح النظام تقديم دعم تعليمي إضافي بناءً على أدائك الأخير.
        </div>
      ) : null}

      {/* Content */}
      <div className={`grid gap-6 ${isStudent && profile ? "lg:grid-cols-5" : ""}`}>
        {/* Personal information */}
        <Card variant="secondary" className={isStudent && profile ? "lg:col-span-3" : ""}>
          <Card.Header>
            <Card.Title>المعلومات الشخصية</Card.Title>
            <Card.Description>بيانات الحساب الأساسية</Card.Description>
          </Card.Header>

          <Card.Content className="space-y-4">
            <TextField>
              <Label>الاسم</Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <Person className="h-4 w-4 text-default-400" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  placeholder="أدخل اسمك"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </InputGroup>
            </TextField>

            <TextField isReadOnly>
              <Label>البريد الإلكتروني</Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <Envelope className="h-4 w-4 text-default-400" />
                </InputGroup.Prefix>
                <InputGroup.Input type="email" value={user.email} />
              </InputGroup>
            </TextField>

            <TextField>
              <Label>رقم الهاتف</Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <Smartphone className="h-4 w-4 text-default-400" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  value={phone}
                  className="placeholder:text-default-400 px-4"
                  onChange={(event) => setPhone(event.target.value)}
                />
              </InputGroup>
            </TextField>

            
          </Card.Content>

          <Card.Footer>
            <Button variant="primary">
              <FloppyDisk className="h-4 w-4" />
              حفظ التغييرات
            </Button>
          </Card.Footer>
        </Card>

        {/* Learning preferences */}
        {isStudent && profile ? (
          <Card variant="transparent" className="lg:col-span-2">
            <Card.Header>
              <Card.Title>تفضيلات التعلم</Card.Title>
              <Card.Description>لتخصيص طريقة عرض المحتوى لك</Card.Description>
            </Card.Header>

            <Card.Content className="space-y-2.5">
              <PreferenceToggle
                icon={<BookOpen className="h-4 w-4" />}
                title="محتوى مبسّط"
                description="عرض الدروس بطريقة أسهل"
                checked={preferSimplified}
                onChange={setPreferSimplified}
              />
              <PreferenceToggle
                icon={<BookOpen className="h-4 w-4" />}
                title="تقسيم إلى أجزاء"
                description="تقسيم الدرس إلى خطوات صغيرة"
                checked={preferSplitIntoParts}
                onChange={setPreferSplitIntoParts}
              />
              <PreferenceToggle
                icon={<Picture className="h-4 w-4" />}
                title="رسومات توضيحية"
                description="عناصر بصرية أثناء الشرح"
                checked={preferGraphics}
                onChange={setPreferGraphics}
              />
            </Card.Content>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function ScoreSummary({ score, attempts }: { score: number; attempts: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-default-200 px-4 py-3">
      <div className="relative h-14 w-14 shrink-0">
        <svg viewBox="0 0 64 64" className="h-14 w-14 -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-default-200"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-primary transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
          {Math.round(clamped)}%
        </div>
      </div>

      <div className="text-sm leading-6">
        <p className="flex items-center gap-1.5 font-medium text-foreground">
          <Target className="h-4 w-4 text-primary" />
          متوسط الدرجات
        </p>
        <p className="flex items-center gap-1.5 text-default-500">
          <BookOpen className="h-4 w-4" />
          {attempts} محاولة
        </p>
      </div>
    </div>
  );
}

function PreferenceToggle({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <Switch
      isSelected={checked}
      onChange={onChange}
      className="w-full rounded-xl border border-default-200 px-3 py-2.5 transition-colors data-[selected]:border-primary/40 data-[selected]:bg-primary/5"
    >
      <Switch.Content className="w-full flex-row items-center justify-between gap-3">
        <span className="flex items-center gap-2.5 text-start">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-default-100 text-default-500">
            {icon}
          </span>
          <span>
            <Label className="text-sm font-medium text-foreground">{title}</Label>
            <p className="text-xs text-default-500">{description}</p>
          </span>
        </span>

        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Content>
    </Switch>
  );
}