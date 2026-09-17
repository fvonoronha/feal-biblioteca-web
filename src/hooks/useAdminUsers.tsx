"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { listUsersAdmin, updateUserRole, updateUserStatus, updateUserInfo, preRegisterUser } from "endpoints";
import { toaster } from "components";
import { APICallOptions, User } from "types";
import { usePaginatedResource } from "./usePaginatedResource";
import { useDebounce } from "./useDebounce";

const SEARCH_DEBOUNCE_DELAY_IN_MS = 400;
const ADMIN_USERS_PER_PAGE = 20;
const AUTO_LOAD_PAGES_BEFORE_MANUAL = 2;

type StatusFilter = "all" | "A" | "P" | "I";
type RoleFilter = "all" | "ADMIN" | "LIBRARIAN" | "MEMBER";

type PendingRoleChange = { user: User; role: string } | null;
type PendingStatusChange = { user: User; status: string } | null;

export const useAdminUsers = () => {
    const t = useTranslations("AdminUsers");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<StatusFilter>("all");
    const [role, setRole] = useState<RoleFilter>("all");
    const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_DELAY_IN_MS);

    const fetchUsersPage = useCallback(
        (page: number, options: APICallOptions) =>
            listUsersAdmin(
                {
                    search: debouncedSearch.trim() || undefined,
                    status: status === "all" ? undefined : status,
                    role: role === "all" ? undefined : role
                },
                { limit: ADMIN_USERS_PER_PAGE, page },
                options
            ),
        [debouncedSearch, status, role]
    );

    const {
        elements: users,
        isLoading,
        isLoadingFirstPage,
        isReloading,
        hasFailed,
        pagination,
        canAutoLoad,
        loadMore,
        loadMoreRef,
        setElements
    } = usePaginatedResource(fetchUsersPage, [], AUTO_LOAD_PAGES_BEFORE_MANUAL);

    const [pendingRoleChange, setPendingRoleChange] = useState<PendingRoleChange>(null);
    const [pendingStatusChange, setPendingStatusChange] = useState<PendingStatusChange>(null);
    const [isChangingRole, setIsChangingRole] = useState(false);
    const [isChangingStatus, setIsChangingStatus] = useState(false);

    const requestRoleChange = (user: User, newRole: string) => setPendingRoleChange({ user, role: newRole });
    const cancelRoleChange = () => {
        if (isChangingRole) return;
        setPendingRoleChange(null);
    };

    const confirmRoleChange = async () => {
        if (!pendingRoleChange || isChangingRole) return;
        setIsChangingRole(true);

        try {
            await updateUserRole(pendingRoleChange.user.id, pendingRoleChange.role);
            setElements((prev) =>
                prev.map((user) => (user.id === pendingRoleChange.user.id ? { ...user, role: pendingRoleChange.role } : user))
            );
            setPendingRoleChange(null);
            toaster.create({ type: "success", title: t("roleChangeSuccess") });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.user?.error;
            toaster.create({
                type: "error",
                title: t("roleChangeGenericError"),
                description: Array.isArray(apiErrors) ? apiErrors[0]?.message : undefined
            });
        } finally {
            setIsChangingRole(false);
        }
    };

    const requestStatusChange = (user: User, newStatus: string) => setPendingStatusChange({ user, status: newStatus });
    const cancelStatusChange = () => {
        if (isChangingStatus) return;
        setPendingStatusChange(null);
    };

    const confirmStatusChange = async () => {
        if (!pendingStatusChange || isChangingStatus) return;
        setIsChangingStatus(true);

        try {
            await updateUserStatus(pendingStatusChange.user.id, pendingStatusChange.status);
            setElements((prev) =>
                prev.map((user) =>
                    user.id === pendingStatusChange.user.id ? { ...user, status: pendingStatusChange.status } : user
                )
            );
            setPendingStatusChange(null);
            toaster.create({ type: "success", title: t("statusChangeSuccess") });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.user?.error;
            toaster.create({
                type: "error",
                title: t("statusChangeGenericError"),
                description: Array.isArray(apiErrors) ? apiErrors[0]?.message : undefined
            });
        } finally {
            setIsChangingStatus(false);
        }
    };

    // --- Pré-cadastro de novo usuário (mesma ideia do fluxo de novo empréstimo, só que
    // acessível direto da tela de gestão de usuários) ---
    const [isPreRegisterOpen, setIsPreRegisterOpen] = useState(false);
    const [isPreRegistering, setIsPreRegistering] = useState(false);
    const [preRegisterErrors, setPreRegisterErrors] = useState<string[]>([]);

    const openPreRegisterForm = () => {
        setPreRegisterErrors([]);
        setIsPreRegisterOpen(true);
    };

    const closePreRegisterForm = () => {
        if (isPreRegistering) return;
        setIsPreRegisterOpen(false);
    };

    const submitPreRegister = async (payload: { name: string; phone: string; document: string }) => {
        if (isPreRegistering) return;
        setIsPreRegistering(true);
        setPreRegisterErrors([]);

        try {
            const created = await preRegisterUser(payload);
            if (created) {
                setElements((prev) => [created, ...prev.filter((user) => user.id !== created.id)]);
                setIsPreRegisterOpen(false);
                toaster.create({ type: "success", title: t("preRegisterSuccessTitle"), description: created.name });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.user?.error;
            setPreRegisterErrors(
                Array.isArray(apiErrors) ? apiErrors.map((item: { message: string }) => item.message) : [t("preRegisterGenericError")]
            );
        } finally {
            setIsPreRegistering(false);
        }
    };

    // --- Editar dados de contato de outro usuário (completude cadastral) ---
    const [editingInfoUser, setEditingInfoUser] = useState<User | null>(null);
    const [isSavingInfo, setIsSavingInfo] = useState(false);
    const [editInfoErrors, setEditInfoErrors] = useState<string[]>([]);

    const openEditInfoForm = (user: User) => {
        setEditInfoErrors([]);
        setEditingInfoUser(user);
    };

    const closeEditInfoForm = () => {
        if (isSavingInfo) return;
        setEditingInfoUser(null);
    };

    const saveUserInfo = async (payload: { name?: string; display_name?: string; email?: string; phone?: string }) => {
        if (!editingInfoUser || isSavingInfo) return;
        setIsSavingInfo(true);
        setEditInfoErrors([]);

        try {
            const updated = await updateUserInfo(editingInfoUser.id, payload);
            if (updated) {
                setElements((prev) => prev.map((user) => (user.id === updated.id ? { ...user, ...updated } : user)));
                setEditingInfoUser(null);
                toaster.create({ type: "success", title: t("editInfoSuccessTitle") });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.user?.error;
            setEditInfoErrors(
                Array.isArray(apiErrors) ? apiErrors.map((item: { message: string }) => item.message) : [t("editInfoGenericError")]
            );
        } finally {
            setIsSavingInfo(false);
        }
    };

    return {
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
    };
};
