"use client";

import { useTranslations } from "next-intl";
import {
    Avatar,
    Badge,
    Box,
    Center,
    Flex,
    Input,
    InputGroup,
    NativeSelect,
    Skeleton,
    Spinner,
    Text,
    VStack
} from "@chakra-ui/react";
import { LuSearch, LuUserPlus, LuPencil } from "react-icons/lu";
import {
    Body,
    PageHeading,
    SimpleButton,
    ConfirmDialog,
    AdminListRow,
    PreRegisterUserDialog,
    EditUserInfoDialog
} from "components";
import { useAdminUsers } from "hooks";
import { useAuthContext } from "contexts";
import { maskCPF, maskPhone, parseDateFullText } from "utils";

const STATUS_FILTERS = ["all", "A", "P", "I"] as const;
const ROLE_FILTERS = ["all", "ADMIN", "LIBRARIAN", "MEMBER"] as const;
const ROLE_OPTIONS = ["MEMBER", "LIBRARIAN", "ADMIN"] as const;

export default function UsuariosPage() {
    const t = useTranslations("AdminUsers");
    const { user: currentUser } = useAuthContext();
    const canManageRoleAndStatus = currentUser?.role === "ADMIN";
    const {
        search,
        setSearch,
        status,
        setStatus,
        role,
        setRole,
        users,
        isLoading,
        isLoadingFirstPage,
        isReloading,
        hasFailed,
        pagination,
        canAutoLoad,
        loadMore,
        loadMoreRef,

        pendingRoleChange,
        requestRoleChange,
        cancelRoleChange,
        isChangingRole,
        confirmRoleChange,

        pendingStatusChange,
        requestStatusChange,
        cancelStatusChange,
        isChangingStatus,
        confirmStatusChange,

        isPreRegisterOpen,
        openPreRegisterForm,
        closePreRegisterForm,
        isPreRegistering,
        preRegisterErrors,
        submitPreRegister,

        editingInfoUser,
        openEditInfoForm,
        closeEditInfoForm,
        isSavingInfo,
        editInfoErrors,
        saveUserInfo
    } = useAdminUsers();

    return (
        <Body>
            <Flex
                pb="24px"
                w="100%"
                direction={{ base: "column", md: "row" }}
                align={{ base: "stretch", md: "flex-end" }}
                justify="space-between"
                gap={4}
            >
                <PageHeading header={t("title")} description={t("description")} />

                <SimpleButton flexShrink={0} onClick={openPreRegisterForm}>
                    <LuUserPlus /> {t("preRegisterButton")}
                </SimpleButton>
            </Flex>

            <Flex direction={{ base: "column", md: "row" }} gap={3} pb={4}>
                <InputGroup flex={1} startElement={<LuSearch size={16} />}>
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={t("searchPlaceholder")}
                        size="sm"
                        borderRadius="md"
                    />
                </InputGroup>

                <NativeSelect.Root size="sm" w={{ base: "full", md: "180px" }}>
                    <NativeSelect.Field
                        value={status}
                        onChange={(event) => setStatus(event.target.value as typeof status)}
                    >
                        {STATUS_FILTERS.map((value) => (
                            <option key={value} value={value}>
                                {t(`statusFilter_${value}`)}
                            </option>
                        ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                </NativeSelect.Root>

                <NativeSelect.Root size="sm" w={{ base: "full", md: "180px" }}>
                    <NativeSelect.Field value={role} onChange={(event) => setRole(event.target.value as typeof role)}>
                        {ROLE_FILTERS.map((value) => (
                            <option key={value} value={value}>
                                {t(`roleFilter_${value}`)}
                            </option>
                        ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                </NativeSelect.Root>
            </Flex>

            {isLoadingFirstPage ? (
                <Center py={16}>
                    <Spinner size="lg" color="fealRed.solid" />
                </Center>
            ) : hasFailed ? (
                <Center py={16}>
                    <Text color="fg.muted">{t("loadingError")}</Text>
                </Center>
            ) : users.length === 0 ? (
                <Center py={16}>
                    <Text color="fg.muted">{t("nothingFound")}</Text>
                </Center>
            ) : (
                <Skeleton loading={isReloading}>
                    <VStack align="stretch" gap={2} w="100%">
                        {users.map((user) => (
                            <AdminListRow
                                key={String(user.id)}
                                avatar={
                                    <Avatar.Root variant="subtle" flexShrink={0}>
                                        <Avatar.Fallback name={user.name} />
                                    </Avatar.Root>
                                }
                                title={<Text fontWeight="bold">{user.name}</Text>}
                                badges={
                                    <>
                                        {user.status === "P" && (
                                            <Badge colorPalette="yellow" size="sm">
                                                {t("statusFilter_P")}
                                            </Badge>
                                        )}
                                        {user.status === "I" && (
                                            <Badge colorPalette="gray" size="sm">
                                                {t("statusFilter_I")}
                                            </Badge>
                                        )}
                                        {(user.overdue_loan_count || 0) > 0 && (
                                            <Badge colorPalette="red" size="sm">
                                                {t("overdueBadge")}
                                            </Badge>
                                        )}
                                    </>
                                }
                                subtitle={
                                    <Text fontSize="sm" color="fg.muted">
                                        {user.phone ? maskPhone(user.phone) : ""}
                                        {user.document ? ` • ${t("cpfLabel")}: ${maskCPF(user.document)}` : ""}
                                    </Text>
                                }
                                meta={
                                    <Text fontSize="xs" color="fg.subtle">
                                        {t("lastAccessLabel")}:{" "}
                                        {user.last_used_at ? parseDateFullText(user.last_used_at) : t("neverAccessed")}
                                        {" • "}
                                        {t("loanCountLabel")}: {user.loan_count ?? 0}
                                    </Text>
                                }
                                actions={
                                    <>
                                        <SimpleButton
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openEditInfoForm(user)}
                                        >
                                            <LuPencil size={14} /> {t("editInfoButton")}
                                        </SimpleButton>

                                        {canManageRoleAndStatus ? (
                                            <>
                                                <NativeSelect.Root size="sm" w="140px" disabled={user.status === "P"}>
                                                    <NativeSelect.Field
                                                        value={user.role}
                                                        onChange={(event) => {
                                                            if (event.target.value !== user.role)
                                                                requestRoleChange(user, event.target.value);
                                                        }}
                                                    >
                                                        {ROLE_OPTIONS.map((value) => (
                                                            <option key={value} value={value}>
                                                                {t(`roleOption_${value}`)}
                                                            </option>
                                                        ))}
                                                    </NativeSelect.Field>
                                                    <NativeSelect.Indicator />
                                                </NativeSelect.Root>

                                                {user.status !== "P" && (
                                                    <SimpleButton
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            requestStatusChange(user, user.status === "I" ? "A" : "I")
                                                        }
                                                    >
                                                        {user.status === "I"
                                                            ? t("activateButton")
                                                            : t("deactivateButton")}
                                                    </SimpleButton>
                                                )}
                                            </>
                                        ) : (
                                            <Text fontSize="xs" color="fg.muted">
                                                {t(`roleOption_${user.role}`)}
                                            </Text>
                                        )}
                                    </>
                                }
                            />
                        ))}

                        {canAutoLoad ? (
                            <Box ref={loadMoreRef} h="40px">
                                {isLoading && (
                                    <Center h="full">
                                        <Spinner size="md" />
                                    </Center>
                                )}
                            </Box>
                        ) : (
                            pagination.has_next && (
                                <Center py={4}>
                                    <SimpleButton onClick={loadMore} disabled={isLoading}>
                                        {isLoading ? <Spinner size="sm" /> : t("loadMoreButton")}
                                    </SimpleButton>
                                </Center>
                            )
                        )}
                    </VStack>
                </Skeleton>
            )}

            <PreRegisterUserDialog
                open={isPreRegisterOpen}
                onClose={closePreRegisterForm}
                onSubmit={submitPreRegister}
                isSubmitting={isPreRegistering}
                errors={preRegisterErrors}
            />

            <EditUserInfoDialog
                user={editingInfoUser}
                onClose={closeEditInfoForm}
                onSave={saveUserInfo}
                isSaving={isSavingInfo}
                errors={editInfoErrors}
            />

            <ConfirmDialog
                open={!!pendingRoleChange}
                onOpenChange={(open) => !open && cancelRoleChange()}
                title={t("roleChangeConfirmTitle")}
                description={
                    pendingRoleChange
                        ? t("roleChangeConfirmDescription", {
                              name: pendingRoleChange.user.name,
                              role: t(`roleOption_${pendingRoleChange.role}`)
                          })
                        : undefined
                }
                confirmLabel={t("roleChangeConfirmAction")}
                cancelLabel={t("cancelButton")}
                onConfirm={confirmRoleChange}
                isLoading={isChangingRole}
            />

            <ConfirmDialog
                open={!!pendingStatusChange}
                onOpenChange={(open) => !open && cancelStatusChange()}
                title={pendingStatusChange?.status === "I" ? t("deactivateConfirmTitle") : t("activateConfirmTitle")}
                description={
                    pendingStatusChange
                        ? pendingStatusChange.status === "I"
                            ? t("deactivateConfirmDescription", { name: pendingStatusChange.user.name })
                            : t("activateConfirmDescription", { name: pendingStatusChange.user.name })
                        : undefined
                }
                confirmLabel={pendingStatusChange?.status === "I" ? t("deactivateButton") : t("activateButton")}
                cancelLabel={t("cancelButton")}
                onConfirm={confirmStatusChange}
                isLoading={isChangingStatus}
            />
        </Body>
    );
}
