import { default as SobrePage } from "./sobrePage";

export async function generateMetadata() {
    const domain = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}` || "https://biblioteca.feal.espirita.casa";
    const title = "Sobre - Biblioteca Francisco Cândido Xavier";
    const description =
        "Conheça a FEAL, entenda como funciona o empréstimo de livros e saiba como doar obras para o acervo da Biblioteca Francisco Cândido Xavier.";

    return {
        metadataBase: new URL(domain),
        title,
        description,
        alternates: {
            canonical: `${domain}/sobre`
        },
        viewport: "width=device-width, initial-scale=1"
    };
}

export default function Page() {
    return <SobrePage />;
}
