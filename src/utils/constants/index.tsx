import { SortOption } from "types";

export const USER_JWT_TOKEN_NAME = "usrtkn";

export const PUBLIC_ROUTES = [
    { path: "/", whenAuthenticated: "next" },
    { path: "/emprestimos", whenAuthenticated: "next" },
    { path: "/login", whenAuthenticated: "redirect" },
    // { path: "/register", whenAuthenticated: "redirect" },
    { path: "/v/[volume-slug]", whenAuthenticated: "next" }
    // { path: "/b/[book-slug]", whenAuthenticated: "next" }
    // { path: "/a/[author-slug]", whenAuthenticated: "next" }
] as const;

export const TOP_BAR_DEFAULT_ICON_SIZE = 20;

export const APP_MAX_WIDTH_IN_PX = 1600;

export const NEXT_LOCALE_TOKEN_NAME = "NEXT_LOCALE";

export const PAGINATION_DEFAULT_RELATED_VOLUMES_PER_PAGE = 12;

export const PAGINATION_DEFAULT_VOLUMES_PER_PAGE = 24;
export const PAGINATION_DEFAULT_LOANS_PER_PAGE = 24;
export const PAGINATION_UNLIMITED_PER_PAGE = 1000000;

export const DEFAULT_VOLUME_SORT_OPTION: SortOption = {
    value: "sortByLabelDesc",
    label: "sortByLabelDesc",
    field: "label",
    direction: "desc"
};

export const DEFAULT_LOAN_SORT_OPTION: SortOption = {
    value: "sortByDueDateDesc",
    label: "sortByDueDateDesc",
    field: "due_date",
    direction: "desc"
};

export const RELEVANCE_VOLUME_SORT_OPTION: SortOption = {
    value: "sortByQuery",
    label: "sortByQuery",
    field: "search_score",
    direction: "desc"
};

// ToDo: Adjust this value to a more appropriate one, for now it's just a placeholder
export const PAGINATION_DEFAULT_CATEGORIES_TO_EXPLORE = 24;
export const PAGINATION_DEFAULT_TAGS_TO_EXPLORE = 22;
export const PAGINATION_DEFAULT_AUTHORS_TO_EXPLORE = 12;
export const PAGINATION_DEFAULT_VOLUMES_TO_EXPLORE = 6;

export const FILTER_ACTIVATE_SEARCH_AFTER_DELAY_IN_MS = 1000;
export const SHARE_BUTTON_ICON_CHANGE_DELAY_IN_MS = 3000;

export const QUERY_PARAMS_FOR_AUTHOR = "a";
export const QUERY_PARAMS_FOR_SPIRIT_AUTHOR = "e";
export const QUERY_PARAMS_FOR_CATEGORY = "c";
export const QUERY_PARAMS_FOR_TAG = "t";
export const QUERY_PARAMS_FOR_SEARCH = "q";
export const QUERY_PARAMS_FOR_PUBLISHER = "p";

// ToDo: crir um MockerData service depois e transformar isso em uma função. Por hora vai ficar aqui mesmo
export const DEFAULT_EXAMPLE_BOOK_FOR_SKELETON = {
    id: 1,
    slug: "slug",
    title: "title",
    subtitle: "subtitle",
    summary: "",
    description:
        "Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável.",
    recommended_for:
        "Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável.",
    keywords: ["a", "b", "c"],
    last_month_access_count: 10,
    all_time_access_count: 20
};

export const DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON = {
    id: 1,
    slug: "slug",
    name: "name",
    description:
        "Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável.",
    avatar_url: "https://...",
    is_spirit: true,
    _count: {
        books: 10
    }
};
export const DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON = {
    id: 1,
    slug: "slug",
    name: "name",
    description:
        "Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável."
};

export const DEFAULT_EXAMPLE_TAG_FOR_SKELETON = {
    id: 1,
    slug: "slug",
    name: "name",
    description:
        "Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável."
};

export const DEFAULT_EXAMPLE_PUBLISHER_FOR_SKELETON = {
    id: 1,
    slug: "slug",
    name: "name",
    description: "Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. ",
    avatar_url: "https://..."
};

export const DEFAULT_EXAMPLE_VOLUME_FOR_SKELETON = {
    search_score: 10,

    id: 1,
    slug: "slug",
    year: 1857,
    edition: "1",
    isbn: "isbn",
    isbn_old: "isbn",
    pages: 1,
    cover_url: "https://...",
    back_url: "https://...",
    images_url: ["https://...0", "https://...1", "https://...2", "https://...3", "https://...4"],

    label: "label",
    shelf: "shelf",
    description:
        "Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável.",

    keywords: ["a", "b", "c"],

    all_time_access_count: 20,
    last_month_access_count: 10,

    publisher: DEFAULT_EXAMPLE_PUBLISHER_FOR_SKELETON,
    tag: DEFAULT_EXAMPLE_TAG_FOR_SKELETON,
    authors: [DEFAULT_EXAMPLE_AUTHOR_FOR_SKELETON],
    book: DEFAULT_EXAMPLE_BOOK_FOR_SKELETON,
    category: DEFAULT_EXAMPLE_CATEGORY_FOR_SKELETON
};
