import { getVolume } from "endpoints";
import { default as VolumeDetails } from "./volumeDetails";
// ToDo: Ajustar isso. Ficou muito solto.

export async function generateMetadata({ params }: { params: Promise<{ volumeSlug: string }> }) {
    const resolvedParams = await params;
    const slug = resolvedParams.volumeSlug;

    const volume = await getVolume(slug);

    return {
        title: `${volume?.book?.title} | Biblioteca`,
        description:
            `${volume?.book?.subtitle || volume?.book?.description || "Fraternidade Espírita Amor e Luz"}`.slice(
                0,
                160
            ),
        openGraph: {
            title: volume?.book?.title,
            description: volume?.book?.subtitle || volume?.description?.slice(0, 160),
            url: `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}/v/${slug}`,
            siteName: "Biblioteca Francisco Cândido Xavier - FEAL",
            images: [
                {
                    url: volume?.cover_url,
                    width: 800,
                    height: 1100,
                    alt: `Capa do livro ${volume?.book?.title}`
                }
            ],
            type: "book"
        },
        twitter: {
            card: "summary_large_image",
            title: volume?.book?.title,
            description:
                `${volume?.book?.subtitle || volume?.book?.description || "Fraternidade Espírita Amor e Luz"}`.slice(
                    0,
                    160
                ),
            images: [volume?.cover_url]
        }
    };
}

export default function Page() {
    return <VolumeDetails />;
}
