import { Footer } from "components";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            {children}
            <Footer />
        </>
    );
}
