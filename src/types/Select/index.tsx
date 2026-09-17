export type SortOption = {
    value: string;
    label: string;
    field: string;
    direction: "asc" | "desc";
    random?: boolean;
};

export function SORT_OPTIONS() {
    const SORT_OPTIONS: SortOption[] = [
        {
            value: "sortByQuery",
            label: "sortByQuery",
            field: "search_score",
            direction: "desc"
        },
        {
            value: "sortByTitleAsc",
            label: "sortByTitleAsc",
            field: "title",
            direction: "asc"
        },
        {
            value: "sortByTitleDesc",
            label: "sortByTitleDesc",
            field: "title",
            direction: "desc"
        },
        {
            value: "sortByLabelDesc",
            label: "sortByLabelDesc",
            field: "label",
            direction: "desc"
        },
        {
            value: "sortByLabelAsc",
            label: "sortByLabelAsc",
            field: "label",
            direction: "asc"
        },
        // {
        //     value: "sortByCreationDesc",
        //     label: "sortByCreationDesc",
        //     field: "id",
        //     direction: "desc"
        // },
        // {
        //     value: "sortByCreationAsc",
        //     label: "sortByCreationAsc",
        //     field: "id",
        //     direction: "asc"
        // },

        {
            value: "sortByPublishingDateDesc",
            label: "sortByPublishingDateDesc",
            field: "year",
            direction: "desc"
        },
        {
            value: "sortByPublishingDateAsc",
            label: "sortByPublishingDateAsc",
            field: "year",
            direction: "asc"
        },
        {
            value: "sortByPagesDesc",
            label: "sortByPagesDesc",
            field: "pages",
            direction: "desc"
        },
        {
            value: "sortByPagesAsc",
            label: "sortByPagesAsc",
            field: "pages",
            direction: "asc"
        },
        {
            value: "sortByPopularityDesc",
            label: "sortByPopularityDesc",
            field: "last_month_access_count",
            direction: "desc"
        },
        {
            value: "sortByPopularityAllTimeDesc",
            label: "sortByPopularityAllTimeDesc",
            field: "all_time_access_count",
            direction: "desc"
        }
    ];

    return SORT_OPTIONS;
}

// Ordenações disponíveis na listagem administrativa de empréstimos. A opção "padrão" não
// aparece aqui de propósito: sem nenhuma seleção, o back já devolve atrasados > em aberto >
// concluídos (ver DEFAULT_ORDER em loan.service.js) - essas opções são só para quando o
// operador quer uma ordem específica.
export function LOAN_SORT_OPTIONS(): SortOption[] {
    return [
        // Sentinela: `field` vazio sinaliza para useLoans que nenhum "sort" deve ser enviado à
        // API, deixando o back aplicar sua própria ordem padrão (atrasados > em aberto > concluídos).
        { value: "sortByDefault", label: "sortByDefault", field: "", direction: "asc" },
        { value: "sortByDueDateAsc", label: "sortByDueDateAsc", field: "due_date", direction: "asc" },
        { value: "sortByDueDateDesc", label: "sortByDueDateDesc", field: "due_date", direction: "desc" },
        { value: "sortByLoanDateDesc", label: "sortByLoanDateDesc", field: "loan_date", direction: "desc" },
        { value: "sortByLoanDateAsc", label: "sortByLoanDateAsc", field: "loan_date", direction: "asc" },
        { value: "sortByUserNameAsc", label: "sortByUserNameAsc", field: "user_name", direction: "asc" },
        { value: "sortByVolumeTitleAsc", label: "sortByVolumeTitleAsc", field: "volume_title", direction: "asc" }
    ];
}

export type SortSelectProps = {
    value: SortOption;
    label?: string;
    labelPosition?: "top" | "left";
    onChange: (value: SortOption) => void;
    // Permite reaproveitar o componente para outras listagens (ex.: empréstimos) sem duplicar
    // toda a marcação do Select - por padrão usa o catálogo de volumes/namespace "Collection".
    options?: SortOption[];
    namespace?: string;
};
