import { callAPI } from "utils";
import { User } from "types";

type UpdateProfilePayload = {
    name: string;
    display_name?: string;
    email: string;
    phone: string;
    sex?: string;
};

export const updateProfile = async (payload: UpdateProfilePayload): Promise<User | undefined> => {
    const response = await callAPI<{ user?: User }>({
        method: "PUT",
        url: `/account/me`,
        data: payload
    });

    return response?.body?.user;
};

type ChangePasswordPayload = {
    current_password: string;
    new_password: string;
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<boolean> => {
    const response = await callAPI<{ user?: { updated?: boolean } }>({
        method: "PUT",
        url: `/account/password`,
        data: payload
    });

    return !!response?.body?.user?.updated;
};
