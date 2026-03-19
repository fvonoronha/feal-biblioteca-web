import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server";
import { PUBLIC_ROUTES } from "utils";

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/";
const REDIRECT_WHEN_AUTHENTICATED_USER_NOT_ALLOWED_ROUTE = "/";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get("usrtkn")?.value;

    // 1. Função auxiliar para verificar se a rota é pública ignorando o locale
    const isPublic = PUBLIC_ROUTES.find((route) => {
        // Remove o locale da comparação (ex: /pt/b/livro -> /b/livro)
        const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

        // Se for a Home
        if (route.path === "/") {
            return pathWithoutLocale === "/" || pathWithoutLocale === "";
        }

        // Se a rota configurada tem [slug], vamos criar um regex simples
        if (route.path.includes("[")) {
            const regexPath = route.path.replace(/\//g, "\\/").replace(/\[.*?\]/g, "[^/]+");
            return new RegExp(`^${regexPath}$`, "i").test(pathWithoutLocale);
        }

        // Para rotas estáticas (/login, /register)
        return pathWithoutLocale === route.path || pathWithoutLocale === `${route.path}/`;
    });

    // 2. Se for uma rota PÚBLICA
    if (isPublic) {
        // Se já está logado e tenta ir para Login/Register, manda pro Acervo
        if (authToken && isPublic.whenAuthenticated === "redirect") {
            return NextResponse.redirect(new URL(REDIRECT_WHEN_AUTHENTICATED_USER_NOT_ALLOWED_ROUTE, request.url));
        }
        return NextResponse.next();
    }

    // 3. Se for uma rota PRIVADA e não tiver token
    if (!authToken) {
        // IMPORTANTE: Use a URL completa para evitar loops de redirecionamento
        const url = new URL(REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE, request.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    // Mantendo os arquivos estáticos e API fora do middleware
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"]
};
