import type { StaticImageData } from "next/image";

import failed_loading from "assets/images/layouts/load/failed_loading.png";

import bg_test from "assets/images/layouts/bg/bg-pesado.jpeg";
import bg_test_dark from "assets/images/layouts/bg/bg-pesado-dark.jpg";
import bg_login from "assets/images/layouts/bg/bg-plant.jpg";

import feal_logo from "assets/images/layouts/identity/FEAL.png";

export const LoadingIcons: Record<string, StaticImageData> = {
    failed: failed_loading
};

export const bgImages: Record<string, StaticImageData> = {
    login: bg_login,
    dev: bg_test,
    dev_dark: bg_test_dark
};

export const fealIdentity: Record<string, StaticImageData> = {
    logo: feal_logo
};
