"use client";

import { useRouter } from "next/navigation";
import { LuSearch } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { NavBarIconMenu } from "components";

// Só navega - a busca em si é uma rota interceptada (ver src/app/@modal/(.)buscar), que abre
// por cima da página atual (seja lá qual for) sem desmontar nada por trás dela, igual ao
// login/autor.
const SearchInput = () => {
    const t = useTranslations("Collection");
    const router = useRouter();

    return <NavBarIconMenu icon={<LuSearch />} aria-label={t("filterSearchLabel")} onClick={() => router.push("/buscar")} />;
};

export default SearchInput;
