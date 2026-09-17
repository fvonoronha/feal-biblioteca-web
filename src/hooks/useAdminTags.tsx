"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { listTagsAdmin, createTag, updateTag, deleteTag, TagPayload } from "endpoints";
import { toaster } from "components";
import { APICallOptions, Tag } from "types";
import { usePaginatedResource } from "./usePaginatedResource";
import { useDebounce } from "./useDebounce";

const SEARCH_DEBOUNCE_DELAY_IN_MS = 400;
const ADMIN_PER_PAGE = 20;
const AUTO_LOAD_PAGES_BEFORE_MANUAL = 2;

const SORT_OPTIONS = [
    { value: "name_asc", by: "name", order: "asc" as const },
    { value: "name_desc", by: "name", order: "desc" as const },
    { value: "created_at_desc", by: "created_at", order: "desc" as const },
    { value: "books_count_desc", by: "books_count", order: "desc" as const }
];

export const useAdminTags = () => {
    const t = useTranslations("AdminTags");
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_DELAY_IN_MS);
    const [sort, setSort] = useState(SORT_OPTIONS[0].value);

    const sortOptions = SORT_OPTIONS.map((option) => ({ value: option.value, label: t(`sortOption_${option.value}`) }));

    const fetchPage = useCallback(
        (page: number, options: APICallOptions) => {
            const activeSort = SORT_OPTIONS.find((option) => option.value === sort) || SORT_OPTIONS[0];
            return listTagsAdmin(
                { search: debouncedSearch.trim() || undefined },
                { limit: ADMIN_PER_PAGE, page, sort: { by: activeSort.by, order: activeSort.order } },
                options
            );
        },
        [debouncedSearch, sort]
    );

    const {
        elements: tags,
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
    } = usePaginatedResource(fetchPage, [], AUTO_LOAD_PAGES_BEFORE_MANUAL);

    const [editingItem, setEditingItem] = useState<Tag | "new" | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [deletingItem, setDeletingItem] = useState<Tag | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateForm = () => {
        setFormErrors([]);
        setEditingItem("new");
    };

    const openEditForm = (item: Tag) => {
        setFormErrors([]);
        setEditingItem(item);
    };

    const closeForm = () => {
        if (isSaving) return;
        setEditingItem(null);
    };

    const saveItem = async (payload: TagPayload) => {
        if (isSaving) return;
        setIsSaving(true);
        setFormErrors([]);

        try {
            if (editingItem === "new") {
                await createTag(payload);
                toaster.create({ type: "success", title: t("createSuccessTitle") });
            } else if (editingItem) {
                await updateTag(editingItem.id, payload);
                toaster.create({ type: "success", title: t("updateSuccessTitle") });
            }

            setEditingItem(null);
            reload();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.tag?.error;
            setFormErrors(
                Array.isArray(apiErrors) ? apiErrors.map((item: { message: string }) => item.message) : [t("saveGenericError")]
            );
        } finally {
            setIsSaving(false);
        }
    };

    const requestDelete = (item: Tag) => setDeletingItem(item);
    const cancelDelete = () => {
        if (isDeleting) return;
        setDeletingItem(null);
    };

    const confirmDelete = async () => {
        if (!deletingItem || isDeleting) return;
        setIsDeleting(true);

        try {
            await deleteTag(deletingItem.id);
            setElements((prev) => prev.filter((item) => item.id !== deletingItem.id));
            setDeletingItem(null);
            toaster.create({ type: "success", title: t("deleteSuccessTitle") });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.tag?.error;
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
        tags,
        isLoading,
        isLoadingFirstPage,
        isReloading,
        hasFailed,
        pagination,
        canAutoLoad,
        loadMore,
        loadMoreRef,

        editingItem,
        openCreateForm,
        openEditForm,
        closeForm,
        isSaving,
        formErrors,
        saveItem,

        deletingItem,
        requestDelete,
        cancelDelete,
        isDeleting,
        confirmDelete
    };
};
