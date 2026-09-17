import { default as MeusEmprestimosPage } from "./emprestimosPage";

export const metadata = {
    title: "Meus empréstimos - Biblioteca FEAL",
    robots: {
        index: false,
        follow: false
    }
};

export default function Page() {
    return <MeusEmprestimosPage />;
}
