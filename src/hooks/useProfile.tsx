"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { updateProfile } from "endpoints";
import { useAuthContext } from "contexts";
import { toaster } from "components";
import { getOnlyNumbers, maskPhone, isEmailValid } from "utils";

type ProfileForm = {
    name: string;
    display_name: string;
    email: string;
    phone: string;
    sex: string;
};

const emptyForm: ProfileForm = { name: "", display_name: "", email: "", phone: "", sex: "" };

const formFromUser = (user: ReturnType<typeof useAuthContext>["user"]): ProfileForm =>
    user
        ? {
              name: user.name || "",
              display_name: user.display_name || "",
              email: user.email || "",
              phone: user.phone ? maskPhone(user.phone) : "",
              sex: user.sex || ""
          }
        : emptyForm;

export const useProfile = () => {
    const t = useTranslations("ProfilePage");
    const { user, setUser } = useAuthContext();

    const [form, setForm] = useState<ProfileForm>(() => formFromUser(user));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState(false);

    // Repopula o formulário sempre que o usuário da sessão é (re)carregado ou muda de
    // identidade - inclusive logo após um salvamento bem-sucedido, quando o back devolve os
    // valores canônicos (ex.: nome de exibição preenchido a partir do nome).
    useEffect(() => {
        setForm(formFromUser(user));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const updateField = (field: keyof ProfileForm, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setSuccessMessage(false);
    };

    const validate = (): boolean => {
        const validationErrors: string[] = [];

        if (!form.name.trim()) {
            validationErrors.push(t("validationFullNameRequired"));
        }

        if (!form.email.trim()) {
            validationErrors.push(t("validationEmailRequired"));
        } else if (!isEmailValid(form.email)) {
            validationErrors.push(t("validationEmailInvalid"));
        }

        const phone = getOnlyNumbers(form.phone);
        if (!phone) {
            validationErrors.push(t("validationPhoneRequired"));
        } else if (phone.length < 10) {
            validationErrors.push(t("validationPhoneInvalid"));
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
            const updated = await updateProfile({
                name: form.name.trim(),
                display_name: form.display_name.trim() || undefined,
                email: form.email.trim(),
                phone: getOnlyNumbers(form.phone),
                sex: form.sex || undefined
            });

            if (updated) {
                setUser(updated);
                setSuccessMessage(true);
                toaster.create({
                    type: "success",
                    title: t("saveSuccessTitle"),
                    description: t("saveSuccessMessage")
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const apiErrors = error?.response?.data?.body?.user?.error;
            setErrors(
                Array.isArray(apiErrors) ? apiErrors.map((item: { message: string }) => item.message) : [t("saveErrorGeneric")]
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        user,
        form,
        updateField,
        errors,
        isSubmitting,
        successMessage,
        handleSubmit
    };
};
