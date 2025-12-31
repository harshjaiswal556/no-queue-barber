import { apiClient } from "./apiClient";
const BASE_URL = import.meta.env.VITE_SERVER_SHOP_SERVICE_URL;

export const shopAPI = {
  getAllShops: (queryString?: string) => {
    if (queryString) {
      return apiClient(`${BASE_URL}/api/v1/shop/list${queryString}`, "GET");
    }
    return apiClient(`${BASE_URL}/api/v1/shop/list?limit=6`, "GET");
  },

  getShopById: (id: string) =>
    apiClient(`${BASE_URL}/api/v1/shop/list/${id}`, "GET"),

  getShopAvailabilityByShopId: (id: string, date?: string, token?: string) => {
    let url = `${BASE_URL}/api/v1/availability/${id}`;
    if (date) url += `?date=${date}`;

    return apiClient(url, "GET", undefined, token);
  },

  createShop: (body: any, token?: string) =>
    apiClient(`${BASE_URL}/api/v1/shop/create`, "POST", body, token),

  createShopAvailability: (body: any, token?: string) =>
    apiClient(`${BASE_URL}/api/v1/availability`, "POST", body, token),

  getShopByBarberId: (id: string) =>
    apiClient(`${BASE_URL}/api/v1/shop/barber/${id}`, "GET"),
};
