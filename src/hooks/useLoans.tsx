"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { listLoans, returnLoan, renewLoan } from "endpoints";
import { APICallOptions, Loan, LoanState, SortOption } from "types";
import { PAGINATION_DEFAULT_LOANS_PER_PAGE, DEFAULT_LOAN_SORT_OPTION } from "utils";
import { toaster } from "components";
import { usePaginatedResource } from "./usePaginatedResource";
import { useDebounce } from "./useDebounce";

const SEARCH_DEBOUNCE_DELAY_IN_MS = 400;
// Mesmo padrão híbrido da home: as 2 primeiras páginas carregam sozinhas via scroll, depois
// disso um botão explícito assume - do contrário uma lista de empréstimos grande o bastante
// para rolar para sempre impede o usuário de alcançar o rodapé da página.
const AUTO_LOAD_PAGES_BEFORE_MANUAL = 2;

type LoanStateFilter = LoanState | "all";

type PendingAction = { type: "return" | "renew"; loan: Loan } | null;

export const useLoans = () => {
    const t = useTranslations("Loans");
    const [userSearch, setUserSearch] = useState("");
    const [volumeSearch, setVolumeSearch] = useState("");
    const [state, setState] = useState<LoanStateFilter>("all");
    const [sort, setSort] = useState<SortOption>(DEFAULT_LOAN_SORT_OPTION);

    const debouncedUserSearch = useDebounce(userSearch, SEARCH_DEBOUNCE_DELAY_IN_MS);
    const debouncedVolumeSearch = useDebounce(volumeSearch, SEARCH_DEBOUNCE_DELAY_IN_MS);

    const [pendingAction, setPendingAction] = useState<PendingAction>(null);
    const [isActionSubmitting, setIsActionSubmitting] = useState(false);

    const fetchLoansPage = useCallback(
        (page: number, options: APICallOptions) =>
            listLoans(
                {
                    user_search: debouncedUserSearch.trim() || undefined,
                    volume_search: debouncedVolumeSearch.trim() || undefined,
                    state: state === "all" ? undefined : state
                },
                {
                    limit: PAGINATION_DEFAULT_LOANS_PER_PAGE,
                    page,
                    // `field` vazio (opção "padrão") sinaliza para não enviar sort nenhum, deixando
                    // o back aplicar sua própria ordem (atrasados > em aberto > concluídos).
                    sort: sort.field ? [{ by: sort.field, order: sort.direction }] : undefined
                },
                options
            ),
        [debouncedUserSearch, debouncedVolumeSearch, state, sort]
    );

    const {
        elements: loans,
        isLoading: isLoansLoading,
        isLoadingFirstPage: isLoansLoadingFirstPage,
        isReloading: isLoansReloading,
        hasFailed: isLoansLoadingFailed,
        loadMoreRef,
        pagination,
        canAutoLoad,
        loadMore,
        reload
    } = usePaginatedResource(fetchLoansPage, [], AUTO_LOAD_PAGES_BEFORE_MANUAL);

    const requestReturnLoan = (loan: Loan) => setPendingAction({ type: "return", loan });

    const requestRenewLoan = (loan: Loan) => setPendingAction({ type: "renew", loan });

    const cancelPendingAction = () => {
        if (isActionSubmitting) return;
        setPendingAction(null);
    };

    const confirmPendingAction = async () => {
        if (!pendingAction || isActionSubmitting) return;

        setIsActionSubmitting(true);

        try {
            if (pendingAction.type === "return") {
                await returnLoan(pendingAction.loan.id);
            } else {
                await renewLoan(pendingAction.loan.id);
            }

            setPendingAction(null);
            reload();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.loan?.error;
            toaster.create({
                type: "error",
                title: t("actionGenericError"),
                description: Array.isArray(apiErrors) ? apiErrors[0]?.message : undefined
            });
        } finally {
            setIsActionSubmitting(false);
        }
    };

    return {
        loans,
        isLoansLoading,
        isLoansLoadingFirstPage,
        isLoansReloading,
        isLoansLoadingFailed,
        loadMoreRef,
        pagination,
        canAutoLoad,
        loadMore,

        userSearch,
        setUserSearch,
        volumeSearch,
        setVolumeSearch,
        state,
        setState,
        sort,
        setSort,

        pendingAction,
        isActionSubmitting,
        requestReturnLoan,
        requestRenewLoan,
        cancelPendingAction,
        confirmPendingAction
    };
};
