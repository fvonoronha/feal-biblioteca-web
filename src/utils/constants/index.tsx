export const USER_JWT_TOKEN_NAME = "usrtkn";

export const PUBLIC_ROUTES = [
    { path: "/", whenAuthenticated: "next" },
    { path: "/login", whenAuthenticated: "redirect" },
    // { path: "/register", whenAuthenticated: "redirect" },
    { path: "/b/[book-slug]", whenAuthenticated: "next" }
    // { path: "/a/[author-slug]", whenAuthenticated: "next" }
] as const;

export const APP_MAX_WIDTH_IN_PX = 1600;

export const NEXT_LOCALE_TOKEN_NAME = "NEXT_LOCALE";

export const PAGINATION_DEFAULT_RELATED_BOOKS_PER_PAGE = 12;

export const PAGINATION_DEFAULT_BOOKS_PER_PAGE = 24;
export const PAGINATION_UNLIMITED_BOOKS_PER_PAGE = 1000000;

export const FILTER_ACTIVATE_SEARCH_AFTER_DELAY_IN_MS = 1000;
export const SHARE_BUTTON_ICON_CHANGE_DELAY_IN_MS = 3000;

export const QUERY_PARAMS_FOR_AUTHOR = "a";
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
    publisher: "publisher",
    year: 1857,
    edition: "1",
    isbn: "isbn",
    pages: 1,
    summary: "",
    pdf_url: "",
    cover_url: "https://...",
    images_url: ["https://...0", "https://...1", "https://...2", "https://...3", "https://...4"],
    label: "label",
    shelf: "shelf",
    description:
        "Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável. Aqui uma descrição suuuper longa para que o skeleton fique visualmente mais agradável.",
    loans: [],
    keywords: ["a", "b", "c"],
    tags: [{ tag: { id: 1, slug: "slug1", name: "tag" } }],
    authors: [{ author: { id: 1, slug: "slug1", name: "author", is_spirit: false } }]
};
