import { getBook } from "endpoints";
import { default as BookDetails } from "./bookDetails";
// ToDo: Ajustar isso. Ficou muito solto.

export async function generateMetadata({ params }: { params: Promise<{ bookSlug: string }> }) {
    const resolvedParams = await params;
    const slug = resolvedParams.bookSlug;

    const book = await getBook(slug);

    return {
        title: `${book.title} | Biblioteca`,
        description: `${book.subtitle || book.description || "Fraternidade Espírita Amor e Luz"}`.slice(0, 160),
        openGraph: {
            title: book.title,
            description: book.subtitle || book.description?.slice(0, 160),
            url: `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}/${slug}`,
            siteName: "Biblioteca Francisco Cândido Xavier - FEAL",
            images: [
                {
                    url: book.cover_url,
                    width: 800,
                    height: 1100,
                    alt: `Capa do livro ${book.title}`
                }
            ],
            type: "book"
        },
        twitter: {
            card: "summary_large_image",
            title: book.title,
            description: `${book.subtitle || book.description || "Fraternidade Espírita Amor e Luz"}`.slice(0, 160),
            images: [book.cover_url]
        }
    };
}

export default function Page() {
    return <BookDetails />;
}
