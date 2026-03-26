import type { StaticImageData } from "next/image";

import error_loading from "assets/images/layouts/load/error.png";

import bg_test from "assets/images/layouts/bg/bg-pesado.jpeg";
import bg_test_dark from "assets/images/layouts/bg/bg-pesado-dark.jpg";
import bg_login from "assets/images/layouts/bg/open_book.png";

import feal_logo from "assets/images/layouts/identity/FEAL.png";
import feal_logo_name_white from "assets/images/layouts/identity/Fraternidade_Dark.png";
import feal_logo_name_black from "assets/images/layouts/identity/Fraternidade_Light.png";

{
    /* <a href="https://storyset.com/people">People illustrations by Storyset</a>; */
}

export const LoadingIcons: Record<string, StaticImageData> = {
    failed: error_loading,
    empty: error_loading
};

export const bgImages: Record<string, StaticImageData> = {
    login: bg_login,
    dev: bg_test,
    dev_dark: bg_test_dark
};

export const fealIdentity: Record<string, StaticImageData> = {
    logo: feal_logo,
    logo_name_white: feal_logo_name_white,
    logo_name_black: feal_logo_name_black
};
