import { useState, useEffect, useRef, useCallback } from "react";
import { listLoans, returnLoan } from "endpoints";
import { APIPaginatedResponse, Loan, SortOption } from "types";
import { PAGINATION_DEFAULT_LOANS_PER_PAGE, DEFAULT_LOAN_SORT_OPTION } from "utils";

const INTERSECTION_ROOT_MARGIN_IN_PX = 200;

export const useLoans = () => {
    const pageRef = useRef(1);
    const [hasNext, setHasNext] = useState(true);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const [isLoansLoading, setIsLoansLoading] = useState(true);
    const [isLoansLoadingFailed, setIsLoansLoadingFailed] = useState(false);
    const [returningLoanId, setReturningLoanId] = useState<string | number | null>(null);

    const [loans, setLoans] = useState<APIPaginatedResponse<Loan>>({
        elements: [],
        pagination: {
            page: 1,
            limit: PAGINATION_DEFAULT_LOANS_PER_PAGE,
            total_elements: PAGINATION_DEFAULT_LOANS_PER_PAGE,
            total_pages: 0,
            has_next: false,
            has_previous: false
        }
    });

    const [sort] = useState<SortOption>(DEFAULT_LOAN_SORT_OPTION);

    const loadLoans = useCallback(
        async (reset: boolean = false) => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            const controller = new AbortController();
            abortControllerRef.current = controller;

            setIsLoansLoading(true);
            setIsLoansLoadingFailed(false);

            try {
                if (reset) pageRef.current = 1;

                const pagination = {
                    limit: PAGINATION_DEFAULT_LOANS_PER_PAGE,
                    page: pageRef.current,
                    sort: [
                        { by: sort.field, order: sort.direction },
                        { by: DEFAULT_LOAN_SORT_OPTION.field, order: DEFAULT_LOAN_SORT_OPTION.direction }
                    ]
                };
                const response = await listLoans({}, pagination, { signal: controller.signal });

                setLoans((prev) => ({
                    elements: reset ? response.elements : [...prev.elements, ...response.elements],
                    pagination: response.pagination
                }));

                setHasNext(response.pagination.has_next);
                pageRef.current += 1;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                if (err.name === "CanceledError" || err.name === "AbortError") return;
                setIsLoansLoadingFailed(true);
            } finally {
                if (abortControllerRef.current === controller) {
                    setIsLoansLoading(false);
                }
            }
        },
        [sort]
    );

    const handleReturnLoan = async (loanId: number) => {
        try {
            setReturningLoanId(loanId);
            await returnLoan(loanId);
            const todayDate = new Date();
            setLoans((prev) => ({
                ...prev,
                elements: prev.elements.map((item) => (item.id === loanId ? { ...item, return_date: todayDate } : item))
            }));
        } catch (error) {
            console.error("Erro ao dar baixa no empréstimo:", error);
        } finally {
            setReturningLoanId(null);
        }
    };

    // Infinite Scroll Observer
    useEffect(() => {
        const el = loadMoreRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNext && !isLoansLoading) {
                    loadLoans();
                }
            },
            { rootMargin: `${INTERSECTION_ROOT_MARGIN_IN_PX}px` }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNext, isLoansLoading, loadLoans]);

    // Initial load
    useEffect(() => {
        loadLoans();
    }, [loadLoans]);

    return {
        loans: loans.elements,
        isLoansLoading,
        isLoansLoadingFailed,
        returningLoanId,
        loadMoreRef,
        handleReturnLoan
    };
};
