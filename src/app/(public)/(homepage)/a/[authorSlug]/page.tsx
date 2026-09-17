import { Metadata } from "next";
import { getAuthor } from "endpoints";
import AuthorPage from "./authorPage";

type Props = {
    params: Promise<{ authorSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { authorSlug } = await params;

    let author;
    try {
        author = await getAuthor(authorSlug);
    } catch {
        author = undefined;
    }

    return {
        title: author ? `${author.name} - Biblioteca FEAL` : "Autor - Biblioteca FEAL",
        description: author?.description?.slice(0, 200)
    };
}

export default async function Page({ params }: Props) {
    const { authorSlug } = await params;
    return <AuthorPage authorSlug={authorSlug} />;
}
