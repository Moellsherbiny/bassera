"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Comment, Magnifier, Person } from "@gravity-ui/icons";
import { Button, Input, Modal } from "@heroui/react";

import { getAvailableUsers } from "@/actions/communication/get-users";

type AvailableUser = {
  id: string;
  name: string | null;
  role: "STUDENT" | "TEACHER" | "ADMIN";
};

/* =========================================
   Helpers
========================================= */

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() || "؟";
  }

  return `${parts[0]?.[0] || ""}${
    parts[parts.length - 1]?.[0] || ""
  }`.toUpperCase();
}

function getRoleLabel(role: AvailableUser["role"]) {
  if (role === "TEACHER") return "مدرس";
  if (role === "STUDENT") return "طالب";
  return "مدير";
}

const ROLE_ORDER: AvailableUser["role"][] = ["TEACHER", "STUDENT", "ADMIN"];

const ROLE_GROUP_LABEL: Record<AvailableUser["role"], string> = {
  TEACHER: "المدرسون",
  STUDENT: "الطلاب",
  ADMIN: "الإدارة",
};

/* =========================================
   Component
========================================= */

export default function NewConversationDialog() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<AvailableUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);

    if (!open) {
      setSearch("");
      setNavigatingId(null);
      return;
    }

    setLoading(true);

    try {
      const result = await getAvailableUsers();

      if (result.success) {
        setUsers(result.users);
      } else {
        setUsers([]);
        console.error(result.error);
      }
    } catch (error) {
      console.error("LOAD_USERS_ERROR:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return users;

    return users.filter((user) => {
      const name = user.name?.toLowerCase() ?? "";

      return name.includes(value);
    });
  }, [users, search]);

  const groupedUsers = useMemo(() => {
    return ROLE_ORDER.map((role) => ({
      role,
      users: filteredUsers.filter((user) => user.role === role),
    })).filter((group) => group.users.length > 0);
  }, [filteredUsers]);

  const showGroupLabels = groupedUsers.length > 1;

  const handleSelectUser = (userId: string) => {
    setNavigatingId(userId);
    router.push(`/dashboard/messages/new/${userId}`);
  };

  return (
    <>
      <Button variant="primary" onPress={() => handleOpenChange(true)}>
        <Comment className="size-4" />
        محادثة جديدة
      </Button>

      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        isDismissable
        variant="blur"
      >
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog className="max-h-[80vh]">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Icon className="bg-default text-foreground">
                <Comment className="size-5" />
              </Modal.Icon>

              <Modal.Heading>محادثة جديدة</Modal.Heading>
            </Modal.Header>

            <Modal.Body className="gap-4">
              <div className="relative">
                <Magnifier className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />

                <Input
                  fullWidth
                  variant="secondary"
                  aria-label="البحث عن مستخدم"
                  placeholder="ابحث بالاسم..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pr-10"
                />
              </div>

              <div className="max-h-[420px] overflow-y-auto">
                {loading ? (
                  <div className="space-y-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3"
                      >
                        <div className="size-10 shrink-0 animate-pulse rounded-full bg-default" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 w-28 animate-pulse rounded-full bg-default" />
                          <div className="h-2.5 w-14 animate-pulse rounded-full bg-default" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex min-h-32 flex-col items-center justify-center gap-2 text-center">
                    <div className="flex size-11 items-center justify-center rounded-full bg-default">
                      {search ? (
                        <Magnifier className="size-5 text-muted" />
                      ) : (
                        <Person className="size-5 text-muted" />
                      )}
                    </div>

                    <p className="text-sm font-medium">
                      {search
                        ? "لا يوجد مستخدم مطابق للبحث"
                        : "لا يوجد مستخدمون متاحون"}
                    </p>

                    {search && (
                      <p className="text-xs text-muted">
                        جرّب اسمًا مختلفًا
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groupedUsers.map((group) => (
                      <div key={group.role}>
                        {showGroupLabels && (
                          <p className="mb-1 px-3 text-xs font-medium text-muted">
                            {ROLE_GROUP_LABEL[group.role]}
                          </p>
                        )}

                        <div className="space-y-1">
                          {group.users.map((user) => {
                            const isNavigating = navigatingId === user.id;

                            return (
                              <button
                                key={user.id}
                                type="button"
                                disabled={navigatingId !== null}
                                onClick={() => handleSelectUser(user.id)}
                                className="flex w-full items-center gap-3 rounded-xl p-3 text-right transition-colors hover:bg-default/60 disabled:opacity-50"
                              >
                                <div
                                  className={[
                                    "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                                    user.role === "TEACHER"
                                      ? "bg-accent/10 text-accent"
                                      : "bg-default text-foreground/70",
                                  ].join(" ")}
                                >
                                  {getInitials(user.name || "مستخدم")}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium">
                                    {user.name || "مستخدم"}
                                  </p>

                                  {!showGroupLabels && (
                                    <p className="mt-0.5 text-xs text-muted">
                                      {getRoleLabel(user.role)}
                                    </p>
                                  )}
                                </div>

                                {isNavigating && (
                                  <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-default-300 border-t-accent" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onPress={() => setIsOpen(false)}>
                إلغاء
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}