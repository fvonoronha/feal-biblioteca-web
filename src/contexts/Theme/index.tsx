"use client";

export { useColorMode } from "../../components/Button/ColorModeButton/index";

import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                fealRed: {
                    50: { value: "#fdf3f2" },
                    100: { value: "#f9dfdd" },
                    200: { value: "#f2bfbb" },
                    300: { value: "#e69b95" },
                    400: { value: "#d96f67" },
                    500: { value: "#b93a33" },
                    600: { value: "#9a2721" },
                    700: { value: "#7a1e1a" },
                    800: { value: "#5c1714" },
                    900: { value: "#3d0f0d" },
                    950: { value: "#250807" }
                },

                fealBlue: {
                    50: { value: "#f2f3fa" },
                    100: { value: "#e0e2f2" },
                    200: { value: "#c1c5e5" },
                    300: { value: "#a1a7d8" },
                    400: { value: "#7b83c5" },
                    500: { value: "#6670b8" },
                    600: { value: "#545caa" },
                    700: { value: "#454b8b" },
                    800: { value: "#363a6d" },
                    900: { value: "#282b50" },
                    950: { value: "#181a31" }
                },

                fealLightBlue: {
                    50: { value: "#effaff" },
                    100: { value: "#d9f3fc" },
                    200: { value: "#b8e7f9" },
                    300: { value: "#87d5f2" },
                    400: { value: "#4dbbe8" },
                    500: { value: "#22a6e0" },
                    600: { value: "#0b94db" },
                    700: { value: "#0876b1" },
                    800: { value: "#09618f" },
                    900: { value: "#0b5176" },
                    950: { value: "#07334d" }
                },

                fealPurple: {
                    50: { value: "#faf5fc" },
                    100: { value: "#f1e5f5" },
                    200: { value: "#e3cbea" },
                    300: { value: "#d1a9dc" },
                    400: { value: "#b982c9" },
                    500: { value: "#9d5db0" },
                    600: { value: "#84449a" },
                    700: { value: "#69367b" },
                    800: { value: "#542d62" },
                    900: { value: "#43264e" },
                    950: { value: "#28172f" }
                },

                lightGrayBorder: {
                    value: "gray.200"
                },

                darkGrayBorder: {
                    value: "gray.600"
                }
            }
        },

        semanticTokens: {
            colors: {
                fealRed: {
                    solid: {
                        value: {
                            _light: "{colors.fealRed.600}",
                            _dark: "{colors.fealRed.500}"
                        }
                    },
                    contrast: {
                        value: "white"
                    },
                    fg: {
                        value: {
                            _light: "{colors.fealRed.700}",
                            _dark: "{colors.fealRed.300}"
                        }
                    },
                    muted: {
                        value: {
                            _light: "{colors.fealRed.100}",
                            _dark: "{colors.fealRed.900}"
                        }
                    },
                    subtle: {
                        value: {
                            _light: "{colors.fealRed.50}",
                            _dark: "{colors.fealRed.950}"
                        }
                    },
                    emphasized: {
                        value: {
                            _light: "{colors.fealRed.200}",
                            _dark: "{colors.fealRed.800}"
                        }
                    },
                    focusRing: {
                        value: {
                            _light: "{colors.fealRed.600}",
                            _dark: "{colors.fealRed.400}"
                        }
                    }
                },

                fealBlue: {
                    solid: {
                        value: {
                            _light: "{colors.fealBlue.600}",
                            _dark: "{colors.fealBlue.500}"
                        }
                    },
                    contrast: {
                        value: "white"
                    },
                    fg: {
                        value: {
                            _light: "{colors.fealBlue.700}",
                            _dark: "{colors.fealBlue.300}"
                        }
                    },
                    muted: {
                        value: {
                            _light: "{colors.fealBlue.100}",
                            _dark: "{colors.fealBlue.900}"
                        }
                    },
                    subtle: {
                        value: {
                            _light: "{colors.fealBlue.50}",
                            _dark: "{colors.fealBlue.950}"
                        }
                    },
                    emphasized: {
                        value: {
                            _light: "{colors.fealBlue.200}",
                            _dark: "{colors.fealBlue.800}"
                        }
                    },
                    focusRing: {
                        value: {
                            _light: "{colors.fealBlue.600}",
                            _dark: "{colors.fealBlue.400}"
                        }
                    }
                },

                fealLightBlue: {
                    solid: {
                        value: {
                            _light: "{colors.fealLightBlue.600}",
                            _dark: "{colors.fealLightBlue.500}"
                        }
                    },
                    contrast: {
                        value: "white"
                    },
                    fg: {
                        value: {
                            _light: "{colors.fealLightBlue.700}",
                            _dark: "{colors.fealLightBlue.300}"
                        }
                    },
                    muted: {
                        value: {
                            _light: "{colors.fealLightBlue.100}",
                            _dark: "{colors.fealLightBlue.900}"
                        }
                    },
                    subtle: {
                        value: {
                            _light: "{colors.fealLightBlue.50}",
                            _dark: "{colors.fealLightBlue.950}"
                        }
                    },
                    emphasized: {
                        value: {
                            _light: "{colors.fealLightBlue.200}",
                            _dark: "{colors.fealLightBlue.800}"
                        }
                    },
                    focusRing: {
                        value: {
                            _light: "{colors.fealLightBlue.600}",
                            _dark: "{colors.fealLightBlue.400}"
                        }
                    }
                },

                fealPurple: {
                    solid: {
                        value: {
                            _light: "{colors.fealPurple.600}",
                            _dark: "{colors.fealPurple.500}"
                        }
                    },
                    contrast: {
                        value: "white"
                    },
                    fg: {
                        value: {
                            _light: "{colors.fealPurple.700}",
                            _dark: "{colors.fealPurple.300}"
                        }
                    },
                    muted: {
                        value: {
                            _light: "{colors.fealPurple.100}",
                            _dark: "{colors.fealPurple.900}"
                        }
                    },
                    subtle: {
                        value: {
                            _light: "{colors.fealPurple.50}",
                            _dark: "{colors.fealPurple.950}"
                        }
                    },
                    emphasized: {
                        value: {
                            _light: "{colors.fealPurple.200}",
                            _dark: "{colors.fealPurple.800}"
                        }
                    },
                    focusRing: {
                        value: {
                            _light: "{colors.fealPurple.600}",
                            _dark: "{colors.fealPurple.400}"
                        }
                    }
                },

                fealRedHover: {
                    value: {
                        _light: "{colors.fealRed.700}",
                        _dark: "{colors.fealRed.700}"
                    }
                },

                inputBg: {
                    value: {
                        _light: "#ffffff",
                        _dark: "#000000"
                    }
                }
            }
        },

        slotRecipes: {
            checkbox: {
                slots: ["root", "control", "label"],

                base: {
                    root: {
                        cursor: "pointer",
                        colorPalette: "fealRed"
                    },

                    control: {
                        borderWidth: "2px",
                        cursor: "pointer"
                    },

                    label: {
                        cursor: "pointer"
                    }
                }
            }
        },

        recipes: {
            input: {
                base: {
                    fontSize: "sm",
                    borderBottomWidth: "2px",
                    borderColor: "green",

                    _focus: {
                        borderColor: "fealRedHover",
                        boxShadow: "none"
                    },

                    _focusVisible: {
                        borderColor: "fealRedHover",
                        boxShadow: "none"
                    },

                    _hover: {
                        borderColor: "fealRedHover"
                    }
                },

                variants: {
                    variant: {
                        flushed: {
                            borderWidth: "0 0 2px 0",
                            borderRadius: "0",
                            paddingInline: "0",

                            _focus: {
                                borderColor: "fealRedHover",
                                boxShadow: "none"
                            },

                            _focusVisible: {
                                borderColor: "fealRedHover",
                                boxShadow: "none"
                            }
                        }
                    }
                },

                // defaultVariants: {
                //     variant: "flushed"
                // }
            },

            button: {
                base: {
                    colorPalette: "fealRed"
                }
            }
        }
    }
});

export const fealSystem = createSystem(defaultConfig, config);

export default fealSystem;
