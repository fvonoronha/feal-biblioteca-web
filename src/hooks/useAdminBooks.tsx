"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
    listBooksAdmin,
    createBook,
    updateBook,
    deleteBook,
    BookPayload,
    GeminiBookSuggestion,
    suggestBookEnhancement,
    setBookTags,
    listCategories,
    listPublishersAdmin,
    createPublisher,
    PublisherPayload,
    createAuthor,
    AuthorPayload,
    listVolumes,
    createVolume,
    updateVolume,
    deleteVolume,
    uploadVolumeCover,
    uploadVolumeBack,
    addVolumeAuxImage,
    removeVolumeAuxImage,
    linkAuthorToVolume,
    unlinkAuthorFromVolume,
    VolumePayload
} from "endpoints";
import { toaster } from "components";
import { VolumeFormTarget } from "components/Catalog/CatalogVolumeFormDialog";
import { APICallOptions, Author, Book, Category, Publisher, Volume } from "types";
import { usePaginatedResource } from "./usePaginatedResource";
import { useDebounce } from "./useDebounce";

const sortByName = <T extends { name: string }>(items: T[]): T[] =>
    [...items].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

const SEARCH_DEBOUNCE_DELAY_IN_MS = 400;
const ADMIN_BOOKS_PER_PAGE = 20;
const AUTO_LOAD_PAGES_BEFORE_MANUAL = 2;
const TAXONOMY_LIST_LIMIT = 200;

const SORT_OPTIONS = [
    { value: "title_asc", by: "title", order: "asc" as const },
    { value: "title_desc", by: "title", order: "desc" as const },
    { value: "created_at_desc", by: "created_at", order: "desc" as const },
    { value: "all_time_access_count_desc", by: "all_time_access_count", order: "desc" as const },
    { value: "volumes_count_desc", by: "volumes_count", order: "desc" as const }
];

export const useAdminBooks = () => {
    const t = useTranslations("AdminCatalog");
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_DELAY_IN_MS);
    const [sort, setSort] = useState(SORT_OPTIONS[0].value);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [publisherFilter, setPublisherFilter] = useState("");

    const sortOptions = SORT_OPTIONS.map((option) => ({ value: option.value, label: t(`sortOption_${option.value}`) }));

    const fetchBooksPage = useCallback(
        (page: number, options: APICallOptions) => {
            const activeSort = SORT_OPTIONS.find((option) => option.value === sort) || SORT_OPTIONS[0];
            return listBooksAdmin(
                {
                    search: debouncedSearch.trim() || undefined,
                    category: categoryFilter ? [categoryFilter] : undefined,
                    publisher: publisherFilter ? [publisherFilter] : undefined
                },
                { limit: ADMIN_BOOKS_PER_PAGE, page, sort: { by: activeSort.by, order: activeSort.order } },
                options
            );
        },
        [debouncedSearch, sort, categoryFilter, publisherFilter]
    );

    const {
        elements: books,
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
    } = usePaginatedResource(fetchBooksPage, [], AUTO_LOAD_PAGES_BEFORE_MANUAL);

    // Categorias/editoras pra popular os selects/filtros dos formulários - carregadas uma vez
    // só. Usa a listagem ADMIN (não a pública) pra editora: a pública só traz quem já tem algum
    // volume vinculado, o que esconderia uma editora recém-cadastrada até que ela fosse usada em
    // algum volume - exatamente o cenário que o atalho de cadastro rápido (createPublisherQuick)
    // precisa cobrir. Autores NÃO entram aqui: com potencialmente milhares de registros, o
    // formulário de volume busca autores sob demanda no servidor (ver VolumeAuthorManager),
    // nunca carregando a lista inteira de uma vez.
    const [categories, setCategories] = useState<Category[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);

    useEffect(() => {
        listCategories({}, { limit: TAXONOMY_LIST_LIMIT, page: 1 }).then((response) =>
            setCategories(response.elements)
        );
        listPublishersAdmin({}, { limit: TAXONOMY_LIST_LIMIT, page: 1 }).then((response) =>
            setPublishers(sortByName(response.elements))
        );
    }, []);

    // Cadastro rápido de editora/autor, chamado a partir de um atalho dentro do próprio
    // formulário de volume (ver CatalogVolumeFormDialog) - sem isso, o operador precisava
    // abandonar o cadastro do volume, ir até a tela de editoras/autores, cadastrar, e voltar.
    const createPublisherQuick = async (payload: PublisherPayload): Promise<Publisher | undefined> => {
        const created = await createPublisher(payload);
        if (created) setPublishers((prev) => sortByName([...prev, created]));
        return created;
    };

    const createAuthorQuick = async (payload: AuthorPayload): Promise<Author | undefined> => {
        return await createAuthor(payload);
    };

    const patchBookInList = useCallback(
        (bookId: number, patch: Partial<Book>) => {
            setElements((prev) => prev.map((book) => (book.id === bookId ? { ...book, ...patch } : book)));
        },
        [setElements]
    );

    // --- Criar/editar livro (só os dados do livro - volumes são geridos à parte) ---
    const [editingBook, setEditingBook] = useState<Book | "new" | null>(null);
    const [isSavingBook, setIsSavingBook] = useState(false);
    const [bookFormErrors, setBookFormErrors] = useState<string[]>([]);

    const openCreateBookForm = () => {
        setBookFormErrors([]);
        setEditingBook("new");
    };

    const openEditBookForm = (book: Book) => {
        setBookFormErrors([]);
        setEditingBook(book);
    };

    const closeBookForm = () => {
        if (isSavingBook) return;
        setEditingBook(null);
    };

    const saveBookForm = async (payload: BookPayload) => {
        if (isSavingBook) return;
        setIsSavingBook(true);
        setBookFormErrors([]);

        try {
            if (editingBook === "new") {
                await createBook({ book: payload });
                toaster.create({ type: "success", title: t("createSuccessTitle") });
                reload();
            } else if (editingBook) {
                const updated = await updateBook(editingBook.id, payload);
                if (updated) patchBookInList(editingBook.id, updated);
                toaster.create({ type: "success", title: t("updateSuccessTitle") });
            }

            setEditingBook(null);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.book?.error;
            setBookFormErrors(
                Array.isArray(apiErrors)
                    ? apiErrors.map((item: { message: string }) => item.message)
                    : [t("saveGenericError")]
            );
        } finally {
            setIsSavingBook(false);
        }
    };

    // --- Remover um livro (em cascata remove/desativa também seus volumes) - mantido aqui
    // pronto pra uso, mas por ora nenhuma tela chama `requestDeleteBook` (ver acervoPage.tsx).
    const [deletingBook, setDeletingBook] = useState<Book | null>(null);
    const [isDeletingBook, setIsDeletingBook] = useState(false);

    const requestDeleteBook = (book: Book) => setDeletingBook(book);
    const cancelDeleteBook = () => {
        if (isDeletingBook) return;
        setDeletingBook(null);
    };

    const confirmDeleteBook = async () => {
        if (!deletingBook || isDeletingBook) return;
        setIsDeletingBook(true);

        try {
            await deleteBook(deletingBook.id);
            setElements((prev) => prev.filter((book) => book.id !== deletingBook.id));
            setDeletingBook(null);
            toaster.create({ type: "success", title: t("deleteBookSuccessTitle") });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.book?.error;
            toaster.create({
                type: "error",
                title: t("deleteBookGenericError"),
                description: Array.isArray(apiErrors) ? apiErrors[0]?.message : undefined
            });
        } finally {
            setIsDeletingBook(false);
        }
    };

    // --- Volumes de cada livro, exibidos inline quando o card do livro é expandido (em vez de
    // um modal separado) - um cache simples por bookId, carregado só na primeira expansão.
    const [expandedBookIds, setExpandedBookIds] = useState<Set<number>>(new Set());
    const [volumesByBookId, setVolumesByBookId] = useState<Record<number, Volume[]>>({});
    const [loadingVolumesBookIds, setLoadingVolumesBookIds] = useState<Set<number>>(new Set());

    const loadVolumesForBook = useCallback(async (book: Book): Promise<Volume[]> => {
        setLoadingVolumesBookIds((prev) => new Set(prev).add(book.id));
        try {
            const response = await listVolumes({ book_id: book.id }, { limit: 100, page: 1 });
            setVolumesByBookId((prev) => ({ ...prev, [book.id]: response.elements }));
            return response.elements;
        } finally {
            setLoadingVolumesBookIds((prev) => {
                const next = new Set(prev);
                next.delete(book.id);
                return next;
            });
        }
    }, []);

    const toggleBookVolumes = (book: Book) => {
        setExpandedBookIds((prev) => {
            const next = new Set(prev);
            if (next.has(book.id)) {
                next.delete(book.id);
            } else {
                next.add(book.id);
                if (!volumesByBookId[book.id]) loadVolumesForBook(book);
            }
            return next;
        });
    };

    // --- Formulário (criar/editar) de um volume específico, aberto de dentro da seção
    // expandida de um livro ---
    const [volumeFormTarget, setVolumeFormTarget] = useState<VolumeFormTarget>(null);
    const [isSavingVolume, setIsSavingVolume] = useState(false);
    const [volumeFormErrors, setVolumeFormErrors] = useState<string[]>([]);

    const openAddVolumeForm = (book: Book) => {
        setVolumeFormErrors([]);
        setVolumeFormTarget({ mode: "create", bookId: book.id, bookTitle: book.title });
    };

    const openEditVolumeForm = (volume: Volume, bookTitle: string) => {
        setVolumeFormErrors([]);
        setVolumeFormTarget({ mode: "edit", volume, bookTitle });
    };

    const closeVolumeForm = () => {
        if (isSavingVolume) return;
        setVolumeFormTarget(null);
    };

    const saveVolumeForm = async (payload: Partial<VolumePayload>) => {
        if (!volumeFormTarget || isSavingVolume) return;
        const bookId = volumeFormTarget.mode === "create" ? volumeFormTarget.bookId : volumeFormTarget.volume.book.id;

        setIsSavingVolume(true);
        setVolumeFormErrors([]);

        try {
            if (volumeFormTarget.mode === "create") {
                const created = await createVolume({ ...payload, book_id: bookId });
                toaster.create({ type: "success", title: t("createEditionSuccessTitle") });
                const book = books.find((b) => b.id === bookId);
                if (book) patchBookInList(bookId, { volumes_count: (book.volumes_count || 0) + 1 });

                // Em vez de fechar o diálogo, troca para o modo "edição" do mesmo volume recém-
                // criado: é assim que autores e imagens passam a poder ser adicionados logo após
                // o cadastro, sem reabrir nada - esses dois endpoints (link de autor, upload de
                // imagem) exigem um volume já existente, então só ficam disponíveis a partir daqui.
                if (created && book) {
                    const refreshed = await loadVolumesForBook(book);
                    const fullVolume = refreshed.find((v) => v.id === created.id);
                    setVolumeFormTarget(
                        fullVolume ? { mode: "edit", volume: fullVolume, bookTitle: volumeFormTarget.bookTitle } : null
                    );
                } else {
                    setVolumeFormTarget(null);
                }
            } else {
                await updateVolume(volumeFormTarget.volume.id, payload);
                toaster.create({ type: "success", title: t("updateVolumeSuccessTitle") });
                setVolumeFormTarget(null);
                const book = books.find((b) => b.id === bookId);
                if (book) loadVolumesForBook(book);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.volume?.error;
            setVolumeFormErrors(
                Array.isArray(apiErrors)
                    ? apiErrors.map((item: { message: string }) => item.message)
                    : [t("saveGenericError")]
            );
        } finally {
            setIsSavingVolume(false);
        }
    };

    // Mantido pronto pra uso (mesmo raciocínio de requestDeleteBook acima) - nenhuma tela chama
    // `requestDeleteVolume` por ora.
    const [deletingVolume, setDeletingVolume] = useState<Volume | null>(null);
    const [isDeletingVolume, setIsDeletingVolume] = useState(false);

    const requestDeleteVolume = (volume: Volume) => setDeletingVolume(volume);
    const cancelDeleteVolume = () => {
        if (isDeletingVolume) return;
        setDeletingVolume(null);
    };

    const confirmDeleteVolume = async () => {
        if (!deletingVolume || isDeletingVolume) return;
        const bookId = deletingVolume.book.id;
        setIsDeletingVolume(true);

        try {
            await deleteVolume(deletingVolume.id);
            setVolumesByBookId((prev) => ({
                ...prev,
                [bookId]: (prev[bookId] || []).filter((volume) => volume.id !== deletingVolume.id)
            }));
            const book = books.find((b) => b.id === bookId);
            if (book) patchBookInList(bookId, { volumes_count: Math.max(0, (book.volumes_count || 1) - 1) });
            setDeletingVolume(null);
            toaster.create({ type: "success", title: t("deleteVolumeSuccessTitle") });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.volume?.error;
            toaster.create({
                type: "error",
                title: t("deleteVolumeGenericError"),
                description: Array.isArray(apiErrors) ? apiErrors[0]?.message : undefined
            });
        } finally {
            setIsDeletingVolume(false);
        }
    };

    // --- Imagens de um volume (capa/verso/imagens auxiliares) - cada ação salva IMEDIATAMENTE
    // no servidor (upload multipart ou PUT simples pra reaproveitar/limpar uma URL), sem
    // esperar o botão "Salvar" do formulário. Depois de cada sucesso, atualiza tanto o cache
    // de volumes do livro (lista expandida) quanto o volume dentro do formulário aberto, se for
    // o mesmo, pra refletir a mudança na hora sem fechar/reabrir o diálogo.
    const [isUploadingVolumeImage, setIsUploadingVolumeImage] = useState(false);
    const [volumeImageError, setVolumeImageError] = useState<string | null>(null);

    const patchVolumeImages = useCallback(
        (volumeId: number, bookId: number, patch: Partial<Pick<Volume, "cover_url" | "back_url" | "images_url">>) => {
            setVolumesByBookId((prev) => {
                if (!prev[bookId]) return prev;
                return { ...prev, [bookId]: prev[bookId].map((v) => (v.id === volumeId ? { ...v, ...patch } : v)) };
            });
            setVolumeFormTarget((prev) =>
                prev && prev.mode === "edit" && prev.volume.id === volumeId
                    ? { ...prev, volume: { ...prev.volume, ...patch } }
                    : prev
            );
        },
        []
    );

    const handleVolumeImageError = (error: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiErrors = (error as any)?.response?.data?.body?.volume?.error;
        setVolumeImageError(Array.isArray(apiErrors) ? apiErrors[0]?.message : t("volumeImageGenericError"));
    };

    const uploadVolumeImage = async (
        field: "cover" | "back" | "aux",
        volumeId: number,
        bookId: number,
        blob: Blob
    ): Promise<boolean> => {
        setIsUploadingVolumeImage(true);
        setVolumeImageError(null);

        try {
            const updated =
                field === "cover"
                    ? await uploadVolumeCover(volumeId, blob)
                    : field === "back"
                      ? await uploadVolumeBack(volumeId, blob)
                      : await addVolumeAuxImage(volumeId, blob);

            if (!updated) throw new Error("Resposta vazia do servidor.");

            patchVolumeImages(volumeId, bookId, {
                cover_url: updated.cover_url,
                back_url: updated.back_url,
                images_url: updated.images_url
            });
            return true;
        } catch (error) {
            handleVolumeImageError(error);
            return false;
        } finally {
            setIsUploadingVolumeImage(false);
        }
    };

    const selectExistingVolumeImage = async (
        field: "cover" | "back" | "aux",
        volumeId: number,
        bookId: number,
        currentImagesUrl: string[],
        url: string
    ): Promise<boolean> => {
        setIsUploadingVolumeImage(true);
        setVolumeImageError(null);

        try {
            const payload: Partial<VolumePayload> =
                field === "cover"
                    ? { cover_url: url }
                    : field === "back"
                      ? { back_url: url }
                      : { images_url: [...currentImagesUrl, url] };

            const updated = await updateVolume(volumeId, payload);
            if (!updated) throw new Error("Resposta vazia do servidor.");

            patchVolumeImages(volumeId, bookId, {
                cover_url: updated.cover_url,
                back_url: updated.back_url,
                images_url: updated.images_url
            });
            return true;
        } catch (error) {
            handleVolumeImageError(error);
            return false;
        } finally {
            setIsUploadingVolumeImage(false);
        }
    };

    const clearVolumeImage = async (field: "cover" | "back", volumeId: number, bookId: number): Promise<boolean> => {
        setIsUploadingVolumeImage(true);
        setVolumeImageError(null);

        try {
            const updated = await updateVolume(volumeId, field === "cover" ? { cover_url: null } : { back_url: null });
            if (!updated) throw new Error("Resposta vazia do servidor.");

            patchVolumeImages(volumeId, bookId, { cover_url: updated.cover_url, back_url: updated.back_url });
            return true;
        } catch (error) {
            handleVolumeImageError(error);
            return false;
        } finally {
            setIsUploadingVolumeImage(false);
        }
    };

    const removeAuxImageFromVolume = async (volumeId: number, bookId: number, url: string): Promise<boolean> => {
        setIsUploadingVolumeImage(true);
        setVolumeImageError(null);

        try {
            const updated = await removeVolumeAuxImage(volumeId, url);
            if (!updated) throw new Error("Resposta vazia do servidor.");

            patchVolumeImages(volumeId, bookId, { images_url: updated.images_url });
            return true;
        } catch (error) {
            handleVolumeImageError(error);
            return false;
        } finally {
            setIsUploadingVolumeImage(false);
        }
    };

    // Versões "amarradas" ao volume atualmente aberto no formulário - é isso que o diálogo
    // efetivamente recebe, já que ele só conhece o campo (capa/verso/auxiliar) e a imagem, não
    // o id do volume/livro.
    const uploadVolumeImageForOpenForm = async (field: "cover" | "back" | "aux", blob: Blob): Promise<boolean> => {
        if (!volumeFormTarget || volumeFormTarget.mode !== "edit") return false;
        return uploadVolumeImage(field, volumeFormTarget.volume.id, volumeFormTarget.volume.book.id, blob);
    };

    const selectExistingVolumeImageForOpenForm = async (
        field: "cover" | "back" | "aux",
        url: string
    ): Promise<boolean> => {
        if (!volumeFormTarget || volumeFormTarget.mode !== "edit") return false;
        return selectExistingVolumeImage(
            field,
            volumeFormTarget.volume.id,
            volumeFormTarget.volume.book.id,
            volumeFormTarget.volume.images_url || [],
            url
        );
    };

    const clearVolumeImageForOpenForm = async (field: "cover" | "back"): Promise<boolean> => {
        if (!volumeFormTarget || volumeFormTarget.mode !== "edit") return false;
        return clearVolumeImage(field, volumeFormTarget.volume.id, volumeFormTarget.volume.book.id);
    };

    const removeAuxImageForOpenForm = async (url: string): Promise<boolean> => {
        if (!volumeFormTarget || volumeFormTarget.mode !== "edit") return false;
        return removeAuxImageFromVolume(volumeFormTarget.volume.id, volumeFormTarget.volume.book.id, url);
    };

    // --- Autores vinculados ao volume aberto no formulário - assim como as imagens acima, cada
    // ação (vincular/desvincular) salva IMEDIATAMENTE no servidor, independente do botão
    // "Salvar" principal do diálogo. Só disponível quando o volume já existe (modo "edit"),
    // porque o endpoint de vínculo precisa de um volume_id válido.
    const [isLinkingAuthor, setIsLinkingAuthor] = useState(false);
    const [authorLinkError, setAuthorLinkError] = useState<string | null>(null);

    const patchVolumeAuthors = useCallback((volumeId: number, bookId: number, nextAuthors: Author[]) => {
        setVolumesByBookId((prev) => {
            if (!prev[bookId]) return prev;
            return { ...prev, [bookId]: prev[bookId].map((v) => (v.id === volumeId ? { ...v, authors: nextAuthors } : v)) };
        });
        setVolumeFormTarget((prev) =>
            prev && prev.mode === "edit" && prev.volume.id === volumeId
                ? { ...prev, volume: { ...prev.volume, authors: nextAuthors } }
                : prev
        );
    }, []);

    const handleAuthorLinkError = (error: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiErrors = (error as any)?.response?.data?.body?.volume_author?.error;
        setAuthorLinkError(Array.isArray(apiErrors) ? apiErrors[0]?.message : t("authorLinkGenericError"));
    };

    // Recebe o autor inteiro (não só o id) porque não existe mais uma lista de autores
    // carregada no cliente pra consultar os dados dele - autores são buscados sob demanda no
    // servidor (ver VolumeAuthorManager), então quem chama já tem o objeto completo em mãos.
    const linkAuthorForOpenForm = async (author: Author, description?: string): Promise<boolean> => {
        if (!volumeFormTarget || volumeFormTarget.mode !== "edit") return false;
        const volume = volumeFormTarget.volume;

        setIsLinkingAuthor(true);
        setAuthorLinkError(null);

        try {
            const link = await linkAuthorToVolume(volume.id, author.id, description);
            if (!link) throw new Error("Resposta vazia do servidor.");

            const nextAuthors = (volume.authors || []).filter((a) => a.id !== author.id);
            nextAuthors.push({ ...author, role: description });

            patchVolumeAuthors(volume.id, volume.book.id, nextAuthors);
            return true;
        } catch (error) {
            handleAuthorLinkError(error);
            return false;
        } finally {
            setIsLinkingAuthor(false);
        }
    };

    const unlinkAuthorForOpenForm = async (authorId: number): Promise<boolean> => {
        if (!volumeFormTarget || volumeFormTarget.mode !== "edit") return false;
        const volume = volumeFormTarget.volume;

        setIsLinkingAuthor(true);
        setAuthorLinkError(null);

        try {
            await unlinkAuthorFromVolume(volume.id, authorId);
            const nextAuthors = (volume.authors || []).filter((a) => a.id !== authorId);
            patchVolumeAuthors(volume.id, volume.book.id, nextAuthors);
            return true;
        } catch (error) {
            handleAuthorLinkError(error);
            return false;
        } finally {
            setIsLinkingAuthor(false);
        }
    };

    // --- Complementar informações do livro com IA (Gemini) ---
    const [geminiBook, setGeminiBook] = useState<Book | null>(null);
    const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
    const [suggestion, setSuggestion] = useState<GeminiBookSuggestion | null>(null);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);
    const [isApplyingSuggestion, setIsApplyingSuggestion] = useState(false);

    const openGeminiSuggest = async (book: Book) => {
        setGeminiBook(book);
        setSuggestion(null);
        setSuggestionError(null);
        setIsLoadingSuggestion(true);

        try {
            const result = await suggestBookEnhancement(book.slug);
            if (result) {
                setGeminiBook(result.book);
                setSuggestion(result.suggestion);
            } else {
                setSuggestionError(t("geminiGenericError"));
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.gemini?.error || error?.response?.data?.body?.book?.error;
            setSuggestionError(Array.isArray(apiErrors) ? apiErrors[0]?.message : t("geminiGenericError"));
        } finally {
            setIsLoadingSuggestion(false);
        }
    };

    const closeGeminiSuggest = () => {
        if (isApplyingSuggestion) return;
        setGeminiBook(null);
        setSuggestion(null);
        setSuggestionError(null);
    };

    const applyGeminiSuggestion = async (bookPayload: Partial<BookPayload>, tagIds: number[] | null) => {
        if (!geminiBook || isApplyingSuggestion) return;
        setIsApplyingSuggestion(true);

        try {
            const hasBookChanges = Object.keys(bookPayload).length > 0;
            const [updated] = await Promise.all([
                hasBookChanges ? updateBook(geminiBook.id, bookPayload) : Promise.resolve(undefined),
                tagIds !== null ? setBookTags(geminiBook.id, tagIds) : Promise.resolve(undefined)
            ]);

            if (updated) patchBookInList(geminiBook.id, updated);
            toaster.create({ type: "success", title: t("geminiApplySuccessTitle") });
            setGeminiBook(null);
            setSuggestion(null);
            reload();
        } catch {
            toaster.create({ type: "error", title: t("geminiApplyGenericError") });
        } finally {
            setIsApplyingSuggestion(false);
        }
    };

    return {
        search,
        setSearch,
        sort,
        setSort,
        sortOptions,
        categoryFilter,
        setCategoryFilter,
        publisherFilter,
        setPublisherFilter,
        books,
        isLoading,
        isLoadingFirstPage,
        isReloading,
        hasFailed,
        pagination,
        canAutoLoad,
        loadMore,
        loadMoreRef,

        categories,
        publishers,
        createPublisherQuick,
        createAuthorQuick,

        editingBook,
        openCreateBookForm,
        openEditBookForm,
        closeBookForm,
        isSavingBook,
        bookFormErrors,
        saveBookForm,

        deletingBook,
        requestDeleteBook,
        cancelDeleteBook,
        isDeletingBook,
        confirmDeleteBook,

        expandedBookIds,
        volumesByBookId,
        loadingVolumesBookIds,
        toggleBookVolumes,

        volumeFormTarget,
        openAddVolumeForm,
        openEditVolumeForm,
        closeVolumeForm,
        isSavingVolume,
        volumeFormErrors,
        saveVolumeForm,

        deletingVolume,
        requestDeleteVolume,
        cancelDeleteVolume,
        isDeletingVolume,
        confirmDeleteVolume,

        isUploadingVolumeImage,
        volumeImageError,
        uploadVolumeImageForOpenForm,
        selectExistingVolumeImageForOpenForm,
        clearVolumeImageForOpenForm,
        removeAuxImageForOpenForm,

        isLinkingAuthor,
        authorLinkError,
        linkAuthorForOpenForm,
        unlinkAuthorForOpenForm,

        geminiBook,
        isLoadingSuggestion,
        suggestion,
        suggestionError,
        isApplyingSuggestion,
        openGeminiSuggest,
        closeGeminiSuggest,
        applyGeminiSuggestion
    };
};
