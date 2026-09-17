import { AuthorDetailDialog } from "components";

export default async function InterceptedAuthorModal({ params }: { params: Promise<{ authorSlug: string }> }) {
    const { authorSlug } = await params;
    return <AuthorDetailDialog authorSlug={authorSlug} />;
}
