"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { searchUsers, preRegisterUser, listVolumes, listLoans, createLoan } from "endpoints";
import { toaster } from "components";
import { APICallOptions, Loan, User, Volume } from "types";
import { createEmptyPaginatedResponse, getOnlyNumbers, isCPFValid, parseDateYMD } from "utils";
import { useAsyncResource } from "./useAsyncResource";
import { useDebounce } from "./useDebounce";

const SEARCH_DEBOUNCE_DELAY_IN_MS = 400;
const SEARCH_RESULTS_LIMIT = 8;
const DEFAULT_LOAN_DURATION_IN_DAYS = 15;
const RECENT_LOANS_LIMIT = 5;

type UserPanelMode = "search" | "create";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractApiErrors = (error: any, bodyKey: string, fallback: string): string[] => {
    const apiErrors = error?.response?.data?.body?.[bodyKey]?.error;
    return Array.isArray(apiErrors) ? apiErrors.map((item) => item.message) : [fallback];
};

const defaultDueDate = () => parseDateYMD(new Date(Date.now() + DEFAULT_LOAN_DURATION_IN_DAYS * 24 * 60 * 60 * 1000));

export const useCreateLoan = () => {
    const router = useRouter();
    const t = useTranslations("NewLoanPage");

    // --- Seleção de volume ---
    const [volumeQuery, setVolumeQuery] = useState("");
    const debouncedVolumeQuery = useDebounce(volumeQuery, SEARCH_DEBOUNCE_DELAY_IN_MS);
    const [selectedVolume, setSelectedVolume] = useState<Volume | null>(null);

    const fetchVolumes = useCallback(
        (options: APICallOptions) => {
            if (debouncedVolumeQuery.trim() === "") return Promise.resolve(createEmptyPaginatedResponse<Volume>());
            return listVolumes(
                { search: debouncedVolumeQuery },
                { limit: SEARCH_RESULTS_LIMIT, page: 1, sort: { by: "search_score", order: "desc" } },
                options
            );
        },
        [debouncedVolumeQuery]
    );

    const volumeResults = useAsyncResource(fetchVolumes, createEmptyPaginatedResponse<Volume>());

    // --- Seleção/criação de usuário ---
    const [userPanelMode, setUserPanelMode] = useState<UserPanelMode>("search");
    const [userQuery, setUserQuery] = useState("");
    const debouncedUserQuery = useDebounce(userQuery, SEARCH_DEBOUNCE_DELAY_IN_MS);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = useCallback(
        (options: APICallOptions) => {
            if (debouncedUserQuery.trim() === "") return Promise.resolve(createEmptyPaginatedResponse<User>());
            return searchUsers({ search: debouncedUserQuery }, { limit: SEARCH_RESULTS_LIMIT, page: 1 }, options);
        },
        [debouncedUserQuery]
    );

    const userResults = useAsyncResource(fetchUsers, createEmptyPaginatedResponse<User>());

    // Histórico recente do usuário selecionado - o operador precisa ver na hora se essa pessoa
    // já está com algum livro em atraso antes de liberar mais um.
    const fetchSelectedUserLoans = useCallback(
        (options: APICallOptions) => {
            if (!selectedUser) return Promise.resolve(createEmptyPaginatedResponse<Loan>());
            // Sem `sort` explícito de propósito: a ordem padrão do back já prioriza atrasados
            // primeiro, depois em aberto, só então concluídos - exatamente o que o operador
            // precisa ver primeiro aqui, mesmo que o atraso não seja do empréstimo mais recente.
            return listLoans({ user_id: selectedUser.id }, { limit: RECENT_LOANS_LIMIT, page: 1 }, options);
        },
        [selectedUser]
    );

    const selectedUserLoansResult = useAsyncResource(fetchSelectedUserLoans, createEmptyPaginatedResponse<Loan>());

    const [newUserForm, setNewUserForm] = useState({ name: "", phone: "", document: "" });
    const [newUserErrors, setNewUserErrors] = useState<string[]>([]);
    const [isCreatingUser, setIsCreatingUser] = useState(false);

    const updateNewUserField = (field: keyof typeof newUserForm, value: string) => {
        setNewUserForm((current) => ({ ...current, [field]: value }));
    };

    const validateNewUserForm = (): boolean => {
        const errors: string[] = [];

        if (!newUserForm.name.trim()) errors.push(t("validationFullNameRequired"));

        const document = getOnlyNumbers(newUserForm.document);
        if (!document) errors.push(t("validationCpfRequired"));
        else if (!isCPFValid(document)) errors.push(t("validationCpfInvalid"));

        const phone = getOnlyNumbers(newUserForm.phone);
        if (!phone) errors.push(t("validationPhoneRequired"));
        else if (phone.length < 10) errors.push(t("validationPhoneInvalid"));

        setNewUserErrors(errors);
        return errors.length === 0;
    };

    const handleCreateUser = async () => {
        if (isCreatingUser) return;
        setNewUserErrors([]);

        if (!validateNewUserForm()) return;

        setIsCreatingUser(true);
        try {
            const created = await preRegisterUser({
                name: newUserForm.name.trim(),
                phone: getOnlyNumbers(newUserForm.phone),
                document: getOnlyNumbers(newUserForm.document)
            });

            if (created) {
                setSelectedUser(created);
                setUserPanelMode("search");
                setNewUserForm({ name: "", phone: "", document: "" });
                toaster.create({
                    type: "success",
                    title: t("preRegisterSuccessTitle"),
                    description: t("preRegisterSuccessDescription", { name: created.name })
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setNewUserErrors(extractApiErrors(error, "user", t("preRegisterGenericError")));
        } finally {
            setIsCreatingUser(false);
        }
    };

    const selectUser = (user: User) => {
        setSelectedUser(user);
        setUserQuery("");
    };

    const clearSelectedUser = () => {
        setSelectedUser(null);
        setUserQuery("");
    };

    const selectVolume = (volume: Volume) => {
        setSelectedVolume(volume);
        setVolumeQuery("");
    };

    const clearSelectedVolume = () => {
        setSelectedVolume(null);
        setVolumeQuery("");
    };

    // --- Detalhes e envio do empréstimo ---
    const [dueDate, setDueDate] = useState(defaultDueDate);
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitErrors, setSubmitErrors] = useState<string[]>([]);

    const canSubmit = !!selectedVolume && !!selectedUser && !isSubmitting;

    const handleSubmit = async () => {
        if (!selectedVolume || !selectedUser || isSubmitting) return;

        setIsSubmitting(true);
        setSubmitErrors([]);

        try {
            const loan = await createLoan({
                volume_id: selectedVolume.id,
                user_id: selectedUser.id,
                due_date: dueDate || undefined,
                description: description.trim() || undefined
            });

            if (loan) {
                toaster.create({
                    type: "success",
                    title: t("createLoanSuccessTitle"),
                    description: t("createLoanSuccessDescription", {
                        title: selectedVolume.book?.title || "",
                        name: selectedUser.name
                    })
                });
                router.push("/emprestimos");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setSubmitErrors(extractApiErrors(error, "loan", t("createLoanGenericError")));
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        volumeQuery,
        setVolumeQuery,
        volumes: volumeResults.data.elements,
        isVolumesLoading: volumeResults.isLoading,
        selectedVolume,
        selectVolume,
        clearSelectedVolume,

        userPanelMode,
        setUserPanelMode,
        userQuery,
        setUserQuery,
        users: userResults.data.elements,
        isUsersLoading: userResults.isLoading,
        selectedUser,
        selectUser,
        clearSelectedUser,
        selectedUserLoans: selectedUserLoansResult.data.elements,
        isSelectedUserLoansLoading: selectedUserLoansResult.isLoading,

        newUserForm,
        updateNewUserField,
        newUserErrors,
        isCreatingUser,
        handleCreateUser,

        dueDate,
        setDueDate,
        description,
        setDescription,

        canSubmit,
        isSubmitting,
        submitErrors,
        handleSubmit
    };
};
