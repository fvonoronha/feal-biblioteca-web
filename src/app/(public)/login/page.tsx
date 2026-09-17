import { AuthPageFallback } from "components";

export async function generateMetadata() {
    const domain = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}` || "https://biblioteca.feal.espirita.casa";

    return {
        metadataBase: new URL(domain),
        title: "Entrar - Biblioteca Francisco Cândido Xavier",
        description: "Acesse sua conta na Biblioteca Francisco Cândido Xavier.",

        alternates: {
            canonical: `${domain}/`
        },

        robots: {
            index: false,
            follow: true
        },

        viewport: "width=device-width, initial-scale=1"
    };
}

export default function Page() {
    return <AuthPageFallback view="login" />;
}
