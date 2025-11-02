import { apiClient } from "./apiClient";

export const usersApi = {
  logout: () => apiClient(`api/users/logout`, "POST"),
  login: (body: any) => apiClient(`api/users/login`, "POST", body),
  register: (body: any) => apiClient(`api/users/register`, "POST", body),
};
