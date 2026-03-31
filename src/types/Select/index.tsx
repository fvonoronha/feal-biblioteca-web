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
            value: "sortByCreationDesc",
            label: "sortByCreationDesc",
            field: "id",
            direction: "desc"
        },
        {
            value: "sortByCreationAsc",
            label: "sortByCreationAsc",
            field: "id",
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

export type SortSelectProps = {
    value: SortOption;
    label?: string;
    labelPosition?: "top" | "left";
    onChange: (value: SortOption) => void;
};
