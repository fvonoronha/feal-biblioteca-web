"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import {
    listAuthorsAdmin,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    suggestAuthorEnhancement,
    uploadAuthorAvatar,
    AuthorPayload,
    GeminiAuthorSuggestion
} from "endpoints";
import { toaster } from "components";
import { APICallOptions, Author } from "types";
import { usePaginatedResource } from "./usePaginatedResource";
import { useDebounce } from "./useDebounce";

const SEARCH_DEBOUNCE_DELAY_IN_MS = 400;
const ADMIN_AUTHORS_PER_PAGE = 20;
const AUTO_LOAD_PAGES_BEFORE_MANUAL = 2;

const SORT_OPTIONS = [
    { value: "name_asc", by: "name", order: "asc" as const },
    { value: "name_desc", by: "name", order: "desc" as const },
    { value: "created_at_desc", by: "created_at", order: "desc" as const },
    { value: "volumes_count_desc", by: "volumes_count", order: "desc" as const }
];

export const useAdminAuthors = () => {
    const t = useTranslations("AdminAuthors");
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_DELAY_IN_MS);
    const [sort, setSort] = useState(SORT_OPTIONS[0].value);

    const sortOptions = SORT_OPTIONS.map((option) => ({ value: option.value, label: t(`sortOption_${option.value}`) }));

    const fetchAuthorsPage = useCallback(
        (page: number, options: APICallOptions) => {
            const activeSort = SORT_OPTIONS.find((option) => option.value === sort) || SORT_OPTIONS[0];
            return listAuthorsAdmin(
                { search: debouncedSearch.trim() || undefined },
                { limit: ADMIN_AUTHORS_PER_PAGE, page, sort: { by: activeSort.by, order: activeSort.order } },
                options
            );
        },
        [debouncedSearch, sort]
    );

    const {
        elements: authors,
        isLoading,
        isLoadingFirstPage,
        isReloading,
        hasFailed,
        pagination,
        canAutoLoad,
        loadMore,
        loadMoreRef,
        reload,
        setElements
    } = usePaginatedResource(fetchAuthorsPage, [], AUTO_LOAD_PAGES_BEFORE_MANUAL);

    const [editingAuthor, setEditingAuthor] = useState<Author | "new" | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [deletingAuthor, setDeletingAuthor] = useState<Author | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateForm = () => {
        setFormErrors([]);
        setEditingAuthor("new");
    };

    const openEditForm = (author: Author) => {
        setFormErrors([]);
        setEditingAuthor(author);
    };

    const closeForm = () => {
        if (isSaving) return;
        setEditingAuthor(null);
    };

    const saveAuthor = async (payload: AuthorPayload) => {
        if (isSaving) return;
        setIsSaving(true);
        setFormErrors([]);

        try {
            if (editingAuthor === "new") {
                await createAuthor(payload);
                toaster.create({ type: "success", title: t("createSuccessTitle") });
            } else if (editingAuthor) {
                await updateAuthor(editingAuthor.id, payload);
                toaster.create({ type: "success", title: t("updateSuccessTitle") });
            }

            setEditingAuthor(null);
            reload();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.author?.error;
            setFormErrors(
                Array.isArray(apiErrors)
                    ? apiErrors.map((item: { message: string }) => item.message)
                    : [t("saveGenericError")]
            );
        } finally {
            setIsSaving(false);
        }
    };

    // --- Foto do autor - salva imediatamente no servidor (upload multipart ou PUT simples pra
    // limpar), independente do botão "Salvar" principal do formulário. Só disponível editando
    // um autor já existente (o endpoint de upload precisa de um author_id válido).
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarError, setAvatarError] = useState<string | null>(null);

    const patchEditingAuthorAvatar = (authorId: number, avatarUrl?: string) => {
        setEditingAuthor((prev) => (prev && prev !== "new" && prev.id === authorId ? { ...prev, avatar_url: avatarUrl } : prev));
        setElements((prev) => prev.map((author) => (author.id === authorId ? { ...author, avatar_url: avatarUrl } : author)));
    };

    const handleAvatarError = (error: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiErrors = (error as any)?.response?.data?.body?.author?.error;
        setAvatarError(Array.isArray(apiErrors) ? apiErrors[0]?.message : t("avatarImageGenericError"));
    };

    const uploadAuthorAvatarForOpenForm = async (blob: Blob): Promise<boolean> => {
        if (!editingAuthor || editingAuthor === "new") return false;
        const authorId = editingAuthor.id;

        setIsUploadingAvatar(true);
        setAvatarError(null);

        try {
            const updated = await uploadAuthorAvatar(authorId, blob);
            if (!updated) throw new Error("Resposta vazia do servidor.");

            patchEditingAuthorAvatar(authorId, updated.avatar_url);
            return true;
        } catch (error) {
            handleAvatarError(error);
            return false;
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const clearAuthorAvatarForOpenForm = async (): Promise<boolean> => {
        if (!editingAuthor || editingAuthor === "new") return false;
        const authorId = editingAuthor.id;

        setIsUploadingAvatar(true);
        setAvatarError(null);

        try {
            const updated = await updateAuthor(authorId, { avatar_url: null });
            if (!updated) throw new Error("Resposta vazia do servidor.");

            patchEditingAuthorAvatar(authorId, updated.avatar_url);
            return true;
        } catch (error) {
            handleAvatarError(error);
            return false;
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    // --- Complementar informações do autor com IA (Gemini) ---
    const [geminiAuthor, setGeminiAuthor] = useState<Author | null>(null);
    const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
    const [suggestion, setSuggestion] = useState<GeminiAuthorSuggestion | null>(null);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);
    const [isApplyingSuggestion, setIsApplyingSuggestion] = useState(false);

    const openGeminiSuggest = async (author: Author) => {
        setGeminiAuthor(author);
        setSuggestion(null);
        setSuggestionError(null);
        setIsLoadingSuggestion(true);

        try {
            const result = await suggestAuthorEnhancement(author.slug);
            if (result) {
                setGeminiAuthor(result.author);
                setSuggestion(result.suggestion);
            } else {
                setSuggestionError(t("geminiGenericError"));
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.gemini?.error || error?.response?.data?.body?.author?.error;
            setSuggestionError(Array.isArray(apiErrors) ? apiErrors[0]?.message : t("geminiGenericError"));
        } finally {
            setIsLoadingSuggestion(false);
        }
    };

    const closeGeminiSuggest = () => {
        if (isApplyingSuggestion) return;
        setGeminiAuthor(null);
        setSuggestion(null);
        setSuggestionError(null);
    };

    const applyGeminiSuggestion = async (authorPayload: Partial<AuthorPayload>) => {
        if (!geminiAuthor || isApplyingSuggestion) return;
        setIsApplyingSuggestion(true);

        try {
            const updated = await updateAuthor(geminiAuthor.id, authorPayload);
            if (updated)
                setElements((prev) =>
                    prev.map((author) => (author.id === geminiAuthor.id ? { ...author, ...updated } : author))
                );
            toaster.create({ type: "success", title: t("geminiApplySuccessTitle") });
            setGeminiAuthor(null);
            setSuggestion(null);
        } catch {
            toaster.create({ type: "error", title: t("geminiApplyGenericError") });
        } finally {
            setIsApplyingSuggestion(false);
        }
    };

    const requestDeleteAuthor = (author: Author) => setDeletingAuthor(author);
    const cancelDeleteAuthor = () => {
        if (isDeleting) return;
        setDeletingAuthor(null);
    };

    const confirmDeleteAuthor = async () => {
        if (!deletingAuthor || isDeleting) return;
        setIsDeleting(true);

        try {
            await deleteAuthor(deletingAuthor.id);
            setElements((prev) => prev.filter((author) => author.id !== deletingAuthor.id));
            setDeletingAuthor(null);
            toaster.create({ type: "success", title: t("deleteSuccessTitle") });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.author?.error;
            toaster.create({
                type: "error",
                title: t("deleteGenericError"),
                description: Array.isArray(apiErrors) ? apiErrors[0]?.message : undefined
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        search,
        setSearch,
        sort,
        setSort,
        sortOptions,
        authors,
        isLoading,
        isLoadingFirstPage,
        isReloading,
        hasFailed,
        pagination,
        canAutoLoad,
        loadMore,
        loadMoreRef,

        editingAuthor,
        openCreateForm,
        openEditForm,
        closeForm,
        isSaving,
        formErrors,
        saveAuthor,

        deletingAuthor,
        requestDeleteAuthor,
        cancelDeleteAuthor,
        isDeleting,
        confirmDeleteAuthor,

        isUploadingAvatar,
        avatarError,
        uploadAuthorAvatarForOpenForm,
        clearAuthorAvatarForOpenForm,

        geminiAuthor,
        isLoadingSuggestion,
        suggestion,
        suggestionError,
        isApplyingSuggestion,
        openGeminiSuggest,
        closeGeminiSuggest,
        applyGeminiSuggestion
    };
};
