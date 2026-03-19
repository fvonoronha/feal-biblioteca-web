"use client";

import { memo } from "react";
import { VStack, Checkbox, Field } from "@chakra-ui/react";

type Option = {
    label: string;
    value: string;
};

type SimpleCheckBoxGroupProps = {
    hide: boolean;
    label: string;
    options: Option[];
    values: string[];
    setValues: (values: string[]) => void;
};
const SimpleCheckBoxGroup = ({ label, hide, options, values, setValues }: SimpleCheckBoxGroupProps) => {
    if (hide || options.length === 0) return <></>;

    return (
        <>
            <Field.Root>
                <Field.Label>{label}</Field.Label>
            </Field.Root>

            <Checkbox.Group value={values} onValueChange={setValues} cursor={"pointer"}>
                <VStack align="start" gap="2">
                    {options.map((opt) => (
                        <Checkbox.Root key={opt.value} value={opt.value} cursor={"pointer"}>
                            <Checkbox.HiddenInput />
                            <Checkbox.Control
                                cursor={"pointer"}
                                borderWidth="2px"
                                _checked={{
                                    bg: "fealRed",
                                    borderColor: "fealRed",
                                    color: "white"
                                }}
                            />
                            <Checkbox.Label>{opt.label}</Checkbox.Label>
                        </Checkbox.Root>
                    ))}
                </VStack>
            </Checkbox.Group>
        </>
    );
};

export default memo(SimpleCheckBoxGroup);
