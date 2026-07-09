import { default as HomePage } from "./HomePage";

export async function generateMetadata() {
    const domain = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}` || "https://biblioteca.feal.espirita.casa";
    const coverImageUrl = "https://r2.biblioteca.feal.espirita.casa/identidade/website.png";
    const title = "Biblioteca Francisco Cândido Xavier - FEAL";
    const description = `O maior acervo de livros espíritas da região. Encontre livros, autores e temas em um catálogo simples e acessível`;

    return {
        metadataBase: new URL(domain),
        title: title,
        description: description,
        keywords:
            "biblioteca espírita, livros espíritas, Allan Kardec, Chico Xavier, Francisco Cândido Xavier, Emmanuel, FEAL, espiritismo, doutrina espírita, obras espíritas, fraternidade espírita amor e luz",

        alternates: {
            canonical: `${domain}/`,
            languages: {
                "pt-BR": `${domain}/`,
                "en-US": `${domain}/en`
            }
        },

        icons: {
            icon: "/favicon.ico",
            apple: "/apple-touch-icon.png"
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1
            }
        },

        openGraph: {
            type: "website",
            locale: "pt_BR",
            url: domain,
            siteName: title,
            title: title,
            description: description,
            images: [
                {
                    url: coverImageUrl,
                    width: 800,
                    height: 800,
                    alt: `HomePage da Biblioteca Espírita Francisco Cândido Xavier`
                }
            ]
        },

        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [coverImageUrl]
        },

        viewport: "width=device-width, initial-scale=1"
    };
}

export default function Page() {
    return <HomePage />;
}
