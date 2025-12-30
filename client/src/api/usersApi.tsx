import { apiClient } from "./apiClient";

const BASE_URL = import.meta.env.VITE_SERVER_USER_SERVICE_URL;

export const usersApi = {
  logout: () => apiClient(`${BASE_URL}api/v1/auth/logout`, "POST"),
  login: (body: any) => apiClient(`${BASE_URL}api/v1/auth/login`, "POST", body),
  register: (body: any) =>
    apiClient(`${BASE_URL}api/v1/auth/register`, "POST", body),
};
