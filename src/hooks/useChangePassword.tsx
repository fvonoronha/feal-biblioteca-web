"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { changePassword } from "endpoints";
import { toaster } from "components";

type ChangePasswordForm = {
    current_password: string;
    new_password: string;
    confirm_password: string;
};

const emptyForm: ChangePasswordForm = { current_password: "", new_password: "", confirm_password: "" };

export const useChangePassword = () => {
    const t = useTranslations("ProfilePage");
    const [form, setForm] = useState<ChangePasswordForm>(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState(false);

    const updateField = (field: keyof ChangePasswordForm, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setSuccessMessage(false);
    };

    const validate = (): boolean => {
        const validationErrors: string[] = [];

        if (!form.current_password) {
            validationErrors.push(t("currentPasswordRequired"));
        }

        if (!form.new_password) {
            validationErrors.push(t("passwordRequired"));
        } else if (form.new_password.length < 8) {
            validationErrors.push(t("passwordNotValid"));
        } else if (form.new_password !== form.confirm_password) {
            validationErrors.push(t("passwordsDontMatch"));
        }

        setErrors(validationErrors);
        return validationErrors.length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) return;

        setErrors([]);
        setSuccessMessage(false);

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const updated = await changePassword({
                current_password: form.current_password,
                new_password: form.new_password
            });

            if (updated) {
                setForm(emptyForm);
                setSuccessMessage(true);
                toaster.create({ type: "success", title: t("changePasswordSuccessTitle") });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.user?.error;
            setErrors(
                Array.isArray(apiErrors)
                    ? apiErrors.map((item: { message: string }) => item.message)
                    : [t("changePasswordGenericError")]
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        updateField,
        errors,
        isSubmitting,
        successMessage,
        handleSubmit
    };
};
