import "./globals.css";
import { Provider } from "components/ui/provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ToastContainer } from "react-toastify";
import { NavbarProvider, AuthContextProvider } from "contexts";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { routing } from "i18n/routing";

export const metadata: Metadata = {
    title: "Biblioteca - FEAL",
    description: "Biblioteca Francisco Cândido Xavier"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "pt";

    if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
        throw new Error(`Locale inválido: ${locale}`);
    }

    /// Isso aqui provavelmente nunca será utilizado, mas eu decidi manter.
    /// Faz com que, dependendo da linguagem, o sistema mude para Right-To-Left reading
    /// (o árabe, por exemplo, funciona assim)
    const dir = locale === "ar" || locale === "he" ? "rtl" : "ltr";
    const messages = await getMessages({ locale });

    return (
        <html lang={locale} dir={dir} suppressHydrationWarning={true}>
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Provider>
                        <ToastContainer />
                        <AuthContextProvider>
                            <NavbarProvider>{children}</NavbarProvider>
                        </AuthContextProvider>
                    </Provider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
