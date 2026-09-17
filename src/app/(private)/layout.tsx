import { Footer } from "components";

// Sem isso, toda página sob (private) (empréstimos, perfil, usuários...) caía direto no
// layout raiz, que nunca renderizou rodapé - o endereço, horário de funcionamento e o
// seletor de idioma só apareciam nas páginas públicas.
export default function PrivateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            {children}
            <Footer />
        </>
    );
}
