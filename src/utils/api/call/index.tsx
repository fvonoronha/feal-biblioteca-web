import axios, { GenericAbortSignal } from "axios";
import { APIResponseType } from "types";
import { getStorage } from "utils";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST,
    timeout: parseInt(process.env.NEXT_PUBLIC_API_CALL_TIMEOUT || "60000")
});

api.interceptors.request.use(
    (config) => {
        try {
            const token = getStorage("usrtkn");
            if (token && !config.headers["Authorization"]) {
                config.headers["Authorization"] = `${token}`;
            }
        } catch {
        } finally {
            return config;
        }
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        return Promise.reject(error);
    }
);

export const callAPI = async ({
    method = "GET",
    url = "/",
    data = {},
    params = {},
    headers = {},
    signal = null
}): Promise<APIResponseType> => {
    if (signal) {
        return await api.request({
            method,
            url,
            data,
            params,
            headers,
            signal: signal as GenericAbortSignal
        });
    } else {
        return await api.request({
            method,
            url,
            data,
            params,
            headers
        });
    }
};

export default api;
