"use client";

import { createContext, ReactNode, useState, useContext, useEffect } from "react";
import { AuthContextType, User } from "types";
import { checkAuthToken } from "endpoints";
import { getStorage, deleteStorage, USER_JWT_TOKEN_NAME, PUBLIC_ROUTES } from "utils";
import { useRouter, usePathname } from "next/navigation";
// import { FullPageLoading } from "components";
import { toaster } from "components";

const defaultValues = {
    user: null,
    setUser: () => {},
    logout: () => {}
};

export const AuthContext = createContext<AuthContextType>(defaultValues);

export function AuthContextProvider({ children }: { children: ReactNode }) {
    const [, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();
    const pathname = usePathname();

    const logout = async () => {
        deleteStorage(USER_JWT_TOKEN_NAME);
        setUser(null);

        toaster.create({
            type: "info",
            title: "Usuário desconectado",
            description: "Sua sessão foi encerrada."
        });

        // 1. Limpa o locale do pathname atual (ex: /pt/b/slug -> /b/slug)
        const cleanPathname = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

        // 2. Verifica se a rota atual é uma das rotas públicas configuradas
        const isPublicRoute = PUBLIC_ROUTES.some((route) => {
            // Normaliza a home
            if (route.path === "/") {
                return cleanPathname === "/" || cleanPathname === "";
            }

            // Converte o padrão [slug] em Regex (ex: /b/[book-slug] -> ^/b/[^/]+$)
            const pattern = new RegExp(`^${route.path.replace(/\//g, "\\/").replace(/\[.*?\]/g, "[^/]+")}\\/?$`, "i");

            return pattern.test(cleanPathname);
        });

        // 3. Se NÃO for uma rota pública, redireciona para o login
        // Se FOR pública (como a página do livro), o usuário continua onde está, mas deslogado
        if (!isPublicRoute) {
            router.push("/login");
        }
    };

    const checkToken = async () => {
        try {
            setIsLoading(true);
            const jwt = getStorage(USER_JWT_TOKEN_NAME);

            const loggedUser = await checkAuthToken(`${jwt}`);

            if (!loggedUser) {
                logout();
            } else {
                setUser(loggedUser);
            }
        } catch {
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkToken();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
            {/* {isLoading ? <FullPageLoading message="Verificando login" pt="50px" /> : children} */}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
