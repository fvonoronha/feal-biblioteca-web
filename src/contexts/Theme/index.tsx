"use client";

export { useColorMode } from "../../components/Button/ColorModeButton/index";

import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                fealRed: { value: "#9a2721" },
                fealLightBlue: { value: "#0b94db" },
                fealBlue: { value: "#545caa" },
                fealPurple: { value: "#84449a" },

                lightGrayBorder: { value: "gray.200" },
                darkGrayBorder: { value: "gray.600" }
            }
        },

        semanticTokens: {
            colors: {
                fealRedHover: {
                    value: {
                        _light: "#7a1e1a",
                        _dark: "#fc8181"
                    }
                }
            }
        }
    }
});

export const fealSystem = createSystem(defaultConfig, config);
