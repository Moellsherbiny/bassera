"use client";

import { useState } from "react";

import {
  Button,
  Card,
  Description,
  FieldError,
  InputGroup,
  Label,
  Modal,
  Switch,
  TextField,
  toast,
} from "@heroui/react";

import {
  BookOpen,
  Eye,
  EyeClosed,
  FloppyDisk,
  Picture,
  ShieldCheck,
} from "@gravity-ui/icons";
import { changePassword } from "@/actions/settings/change-password";
import { updateSettings } from "@/actions/settings/update-settings";

type Settings = {
  preferSimplified: boolean;
  preferSplitIntoParts: boolean;
  preferGraphics: boolean;
};

type Props = {
  settings: Settings;
};

export default function SettingsClient({ settings }: Props) {
  const [savedState, setSavedState] = useState(settings);

  const [preferSimplified, setPreferSimplified] = useState(
    settings.preferSimplified,
  );
  const [preferSplitIntoParts, setPreferSplitIntoParts] = useState(
    settings.preferSplitIntoParts,
  );
  const [preferGraphics, setPreferGraphics] = useState(settings.preferGraphics);

  const isDirty =
    preferSimplified !== savedState.preferSimplified ||
    preferSplitIntoParts !== savedState.preferSplitIntoParts ||
    preferGraphics !== savedState.preferGraphics;

  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isNewPasswordTooShort = newPassword.length > 0 && newPassword.length < 8;
  const isConfirmMismatched =
    confirmPassword.length > 0 && confirmPassword !== newPassword;
  const passwordStrength = getPasswordStrength(newPassword);

  const resetPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning("أكمل جميع حقول كلمة المرور.");
      return;
    }

    if (newPassword.length < 8) {
      toast.warning("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.danger("كلمتا المرور الجديدتان غير متطابقتين.");
      return;
    }

    try {
      setIsChangingPassword(true);

      const result = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!result.success) {
        toast.danger(result.message);
        return;
      }

      toast.success("تم تغيير كلمة المرور بنجاح.");
      resetPasswordFields();
      setIsPasswordModalOpen(false);
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.danger("حدث خطأ أثناء تغيير كلمة المرور. حاول مرة أخرى.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const next = { preferSimplified, preferSplitIntoParts, preferGraphics };
      await updateSettings(next);

      setSavedState(next);
      toast.success("تم حفظ التغييرات.");
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.danger("تعذّر حفظ التغييرات. حاول مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          الإعدادات
        </h1>
        <p className="mt-2 text-sm text-default-500">
          خصص طريقة عرض المحتوى التعليمي بما يناسب أسلوب تعلمك.
        </p>
      </div>

      <div className="space-y-6">
        {/* Learning preferences */}
        <Card variant="secondary">
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <Card.Title>تفضيلات التعلم</Card.Title>
                <Card.Description>
                  اختر الطريقة التي تفضل بها مشاهدة الدروس
                </Card.Description>
              </div>
            </div>
          </Card.Header>

          <Card.Content className="space-y-2.5">
            <PreferenceToggle
              icon={<BookOpen className="h-4 w-4" />}
              title="المحتوى المبسط"
              description="عرض الدروس بطريقة أبسط وأكثر سهولة"
              checked={preferSimplified}
              onChange={setPreferSimplified}
            />
            <PreferenceToggle
              icon={<BookOpen className="h-4 w-4" />}
              title="تقسيم الدرس إلى أجزاء"
              description="عرض الدرس على مراحل بدلًا من عرضه كاملًا مرة واحدة"
              checked={preferSplitIntoParts}
              onChange={setPreferSplitIntoParts}
            />
            <PreferenceToggle
              icon={<Picture className="h-4 w-4" />}
              title="الرسومات التوضيحية"
              description="إظهار الرسومات والعناصر البصرية داخل المحتوى"
              checked={preferGraphics}
              onChange={setPreferGraphics}
            />
          </Card.Content>

          <Card.Footer className="flex items-center justify-between gap-3">
            <p
              className={`text-xs text-default-500 transition-opacity ${
                isDirty ? "opacity-100" : "opacity-0"
              }`}
            >
              تغييرات غير محفوظة
            </p>

            <Button
              variant="primary"
              isPending={isSaving}
              isDisabled={!isDirty && !isSaving}
              onPress={handleSave}
            >
              {({ isPending }) => (
                <>
                  {isPending ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <FloppyDisk className="h-4 w-4" />
                  )}
                  {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                </>
              )}
            </Button>
          </Card.Footer>
        </Card>

        {/* Security */}
        <Card variant="transparent">
          <Card.Content className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-default-100 text-default-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">الأمان وكلمة المرور</p>
                <p className="text-sm text-default-500">
                  قم بتغيير كلمة المرور الخاصة بحسابك للحفاظ على أمانه
                </p>
              </div>
            </div>

            <Button variant="outline" onPress={() => setIsPasswordModalOpen(true)}>
              تغيير كلمة المرور
            </Button>
          </Card.Content>
        </Card>
      </div>

      {/* Password modal */}
      <Modal isOpen={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Heading>تغيير كلمة المرور</Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                <div className="flex flex-col gap-5">
                  <TextField>
                    <Label>كلمة المرور الحالية</Label>
                    <InputGroup>
                      <InputGroup.Input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        placeholder="أدخل كلمة المرور الحالية"
                        autoComplete="current-password"
                      />
                      <InputGroup.Suffix>
                        <Button
                          variant="ghost"
                          isIconOnly
                          size="sm"
                          onPress={() => setShowCurrentPassword((v) => !v)}
                          aria-label={
                            showCurrentPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeClosed className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </InputGroup.Suffix>
                    </InputGroup>
                  </TextField>

                  <TextField isInvalid={isNewPasswordTooShort}>
                    <Label>كلمة المرور الجديدة</Label>
                    <InputGroup>
                      <InputGroup.Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="أدخل كلمة المرور الجديدة"
                        autoComplete="new-password"
                      />
                      <InputGroup.Suffix>
                        <Button
                          variant="ghost"
                          isIconOnly
                          size="sm"
                          onPress={() => setShowNewPassword((v) => !v)}
                          aria-label={
                            showNewPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                          }
                        >
                          {showNewPassword ? (
                            <EyeClosed className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </InputGroup.Suffix>
                    </InputGroup>

                    {newPassword.length > 0 ? (
                      <div className="flex items-center gap-2 pt-1.5">
                        <div className="flex flex-1 gap-1">
                          {[0, 1, 2, 3].map((segment) => (
                            <span
                              key={segment}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                segment < passwordStrength.score
                                  ? passwordStrength.className
                                  : "bg-default-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-default-500">
                          {passwordStrength.label}
                        </span>
                      </div>
                    ) : null}

                    {isNewPasswordTooShort ? (
                      <FieldError>كلمة المرور يجب أن تكون 8 أحرف على الأقل</FieldError>
                    ) : (
                      <Description>يجب أن تكون 8 أحرف على الأقل</Description>
                    )}
                  </TextField>

                  <TextField isInvalid={isConfirmMismatched}>
                    <Label>تأكيد كلمة المرور الجديدة</Label>
                    <InputGroup>
                      <InputGroup.Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="أعد إدخال كلمة المرور الجديدة"
                        autoComplete="new-password"
                      />
                      <InputGroup.Suffix>
                        <Button
                          variant="ghost"
                          isIconOnly
                          size="sm"
                          onPress={() => setShowConfirmPassword((v) => !v)}
                          aria-label={
                            showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeClosed className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </InputGroup.Suffix>
                    </InputGroup>

                    {isConfirmMismatched ? (
                      <FieldError>كلمتا المرور غير متطابقتين</FieldError>
                    ) : null}
                  </TextField>
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="secondary"
                  isDisabled={isChangingPassword}
                  onPress={() => setIsPasswordModalOpen(false)}
                >
                  إلغاء
                </Button>

                <Button
                  variant="primary"
                  isPending={isChangingPassword}
                  onPress={handleChangePassword}
                >
                  {({ isPending }) => (isPending ? "جاري الحفظ..." : "حفظ كلمة المرور")}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </main>
  );
}

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "ضعيفة جدًا", className: "bg-danger-500" },
    { label: "ضعيفة", className: "bg-danger-400" },
    { label: "متوسطة", className: "bg-warning-400" },
    { label: "قوية", className: "bg-success-400" },
    { label: "قوية جدًا", className: "bg-success-600" },
  ];

  return { score, ...levels[score] };
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