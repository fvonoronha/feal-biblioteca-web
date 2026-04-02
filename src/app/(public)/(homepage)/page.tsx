import { default as HomePage } from "./homePage";

export async function generateMetadata() {
    return {
        title: `Biblioteca Francisco Cândido Xavier - FEAL`,
        description: `Acervo digital: Encontre livros, autores e temas em um catálogo simples e acessível`.slice(
            0,
            160
        ),
        openGraph: {
            title: "Biblioteca Francisco Cândido Xavier - FEAL",
            description: "Biblioteca Francisco Cândido Xavier - FEAL",
            url: `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
            siteName: "Biblioteca Francisco Cândido Xavier - FEAL",
            images: [
                {
                    url: "https://r2.biblioteca.feal.espirita.casa/identidade/website.png",
                    width: 800,
                    height: 800,
                    alt: `Biblioteca Francisco Cândido Xavier - FEAL`
                }
            ],
            type: "website"
        },
        twitter: {
            card: "summary_large_image",
            title: "Biblioteca Francisco Cândido Xavier - FEAL",
            description: "Biblioteca Francisco Cândido Xavier - FEAL",
            images: ["https://r2.biblioteca.feal.espirita.casa/identidade/website.png"]
        }
    };
}

export default function Page() {
    return <HomePage />;
}
