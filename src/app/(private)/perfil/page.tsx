import { default as ProfilePage } from "./perfilPage";

export const metadata = {
    title: "Meu perfil - Biblioteca FEAL",
    robots: {
        index: false,
        follow: false
    }
};

export default function Page() {
    return <ProfilePage />;
}
