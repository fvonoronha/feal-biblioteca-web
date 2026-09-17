"use client";

import { useCallback } from "react";
import { listMyLoans } from "endpoints";
import { APICallOptions } from "types";
import { PAGINATION_DEFAULT_LOANS_PER_PAGE } from "utils";
import { usePaginatedResource } from "./usePaginatedResource";

const AUTO_LOAD_PAGES_BEFORE_MANUAL = 1;

// Histórico de empréstimos do próprio usuário logado, mostrado na página de perfil. Sem
// filtros/ordenação de admin - o back já devolve atrasados primeiro, então quem tem um livro
// para devolver vê isso assim que abre a seção.
export const useMyLoans = () => {
    const fetchMyLoansPage = useCallback(
        (page: number, options: APICallOptions) => listMyLoans({}, { limit: PAGINATION_DEFAULT_LOANS_PER_PAGE, page }, options),
        []
    );

    const {
        elements: loans,
        isLoading: isLoansLoading,
        isLoadingFirstPage: isLoansLoadingFirstPage,
        hasFailed: isLoansLoadingFailed,
        pagination,
        canAutoLoad,
        loadMore
    } = usePaginatedResource(fetchMyLoansPage, [], AUTO_LOAD_PAGES_BEFORE_MANUAL);

    return {
        loans,
        isLoansLoading,
        isLoansLoadingFirstPage,
        isLoansLoadingFailed,
        pagination,
        canAutoLoad,
        loadMore
    };
};
