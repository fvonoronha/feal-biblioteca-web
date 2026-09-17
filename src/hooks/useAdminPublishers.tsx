"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { listPublishersAdmin, createPublisher, updatePublisher, deletePublisher, PublisherPayload } from "endpoints";
import { toaster } from "components";
import { APICallOptions, Publisher } from "types";
import { usePaginatedResource } from "./usePaginatedResource";
import { useDebounce } from "./useDebounce";

const SEARCH_DEBOUNCE_DELAY_IN_MS = 400;
const ADMIN_PER_PAGE = 20;
const AUTO_LOAD_PAGES_BEFORE_MANUAL = 2;

const SORT_OPTIONS = [
    { value: "name_asc", by: "name", order: "asc" as const },
    { value: "name_desc", by: "name", order: "desc" as const },
    { value: "created_at_desc", by: "created_at", order: "desc" as const },
    { value: "volumes_count_desc", by: "volumes_count", order: "desc" as const }
];

export const useAdminPublishers = () => {
    const t = useTranslations("AdminPublishers");
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_DELAY_IN_MS);
    const [sort, setSort] = useState(SORT_OPTIONS[0].value);

    const sortOptions = SORT_OPTIONS.map((option) => ({ value: option.value, label: t(`sortOption_${option.value}`) }));

    const fetchPage = useCallback(
        (page: number, options: APICallOptions) => {
            const activeSort = SORT_OPTIONS.find((option) => option.value === sort) || SORT_OPTIONS[0];
            return listPublishersAdmin(
                { search: debouncedSearch.trim() || undefined },
                { limit: ADMIN_PER_PAGE, page, sort: { by: activeSort.by, order: activeSort.order } },
                options
            );
        },
        [debouncedSearch, sort]
    );

    const {
        elements: publishers,
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

    const [editingItem, setEditingItem] = useState<Publisher | "new" | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [deletingItem, setDeletingItem] = useState<Publisher | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateForm = () => {
        setFormErrors([]);
        setEditingItem("new");
    };

    const openEditForm = (item: Publisher) => {
        setFormErrors([]);
        setEditingItem(item);
    };

    const closeForm = () => {
        if (isSaving) return;
        setEditingItem(null);
    };

    const saveItem = async (payload: PublisherPayload) => {
        if (isSaving) return;
        setIsSaving(true);
        setFormErrors([]);

        try {
            if (editingItem === "new") {
                await createPublisher(payload);
                toaster.create({ type: "success", title: t("createSuccessTitle") });
            } else if (editingItem) {
                await updatePublisher(editingItem.id, payload);
                toaster.create({ type: "success", title: t("updateSuccessTitle") });
            }

            setEditingItem(null);
            reload();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.publisher?.error;
            setFormErrors(
                Array.isArray(apiErrors) ? apiErrors.map((item: { message: string }) => item.message) : [t("saveGenericError")]
            );
        } finally {
            setIsSaving(false);
        }
    };

    const requestDelete = (item: Publisher) => setDeletingItem(item);
    const cancelDelete = () => {
        if (isDeleting) return;
        setDeletingItem(null);
    };

    const confirmDelete = async () => {
        if (!deletingItem || isDeleting) return;
        setIsDeleting(true);

        try {
            await deletePublisher(deletingItem.id);
            setElements((prev) => prev.filter((item) => item.id !== deletingItem.id));
            setDeletingItem(null);
            toaster.create({ type: "success", title: t("deleteSuccessTitle") });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.publisher?.error;
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
        publishers,
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
