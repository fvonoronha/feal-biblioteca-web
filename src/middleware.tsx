import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server";
import { PUBLIC_ROUTES } from "utils";

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/";
const REDIRECT_WHEN_AUTHENTICATED_USER_NOT_ALLOWED_ROUTE = "/";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get("usrtkn")?.value;

    const isPublic = PUBLIC_ROUTES.find((route) => {
        const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

        if (route.path === "/") {
            return pathWithoutLocale === "/" || pathWithoutLocale === "";
        }

        if (route.path.includes("[")) {
            const regexPath = route.path.replace(/\//g, "\\/").replace(/\[.*?\]/g, "[^/]+");
            return new RegExp(`^${regexPath}$`, "i").test(pathWithoutLocale);
        }

        return pathWithoutLocale === route.path || pathWithoutLocale === `${route.path}/`;
    });

    if (isPublic) {
        if (authToken && isPublic.whenAuthenticated === "redirect") {
            return NextResponse.redirect(new URL(REDIRECT_WHEN_AUTHENTICATED_USER_NOT_ALLOWED_ROUTE, request.url));
        }
        return NextResponse.next();
    }

    if (!authToken) {
        const url = new URL(REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE, request.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"]
};
