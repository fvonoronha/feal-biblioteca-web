import { redirect } from "next/navigation";

// Talvez seja interessante criar uma página de erro 404 personalizada, mas por enquanto vamos redirecionar para a página inicial.
export default function NotFound() {
    redirect("/");
}
