import { default as NewLoanPage } from "./newLoanPage";

export const metadata = {
    title: "Novo Empréstimo - Biblioteca FEAL",
    robots: {
        index: false,
        follow: false
    }
};

export default function Page() {
    return <NewLoanPage />;
}
