import { memo } from "react";
import { Input, Field } from "@chakra-ui/react";
import { FormInputProps } from "types";

const SimpleInput = ({
    label,
    placeholder,
    type = "text",
    value,
    onChange,
    required,
    errorMessage,
    ...rest
}: FormInputProps) => {
    const isInvalid = Boolean(errorMessage);

    return (
        <Field.Root invalid={isInvalid} required={required}>
            {label && (
                <Field.Label>
                    {label}
                    {required && <Field.RequiredIndicator />}
                </Field.Label>
            )}

            <Input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                variant="flushed"
                fontSize="sm"
                borderBottomWidth="2px"
                colorPalette="primary"
                {...rest}
            />

            {errorMessage && <Field.ErrorText>{errorMessage}</Field.ErrorText>}
        </Field.Root>
    );
};

export default memo(SimpleInput);
