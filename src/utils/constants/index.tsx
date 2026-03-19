export const USER_JWT_TOKEN_NAME = "usrtkn";

export const PUBLIC_ROUTES = [
    { path: "/", whenAuthenticated: "next" },
    { path: "/login", whenAuthenticated: "redirect" },
    { path: "/register", whenAuthenticated: "redirect" },
    { path: "/b/[book-slug]", whenAuthenticated: "next" }
] as const;
export const NEXT_LOCALE_TOKEN_NAME = "NEXT_LOCALE";

export const PAGINATION_DEFAULT_BOOKS_PER_PAGE = 10;
