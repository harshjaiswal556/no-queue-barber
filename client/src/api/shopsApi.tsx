import { apiClient } from "./apiClient";

const SHOP_URL = "api/shops/";

export const shopAPI = {
  getAllShops: (queryString?: string) => {
    if (queryString) {
      console.log(queryString);

      return apiClient(`${SHOP_URL}list${queryString}`, "GET");
    }
    return apiClient(`${SHOP_URL}list?limit=6`, "GET");
  },

  getShopById: (id: string) => apiClient(`${SHOP_URL}list/${id}`, "GET"),

  getShopAvailabilityByShopId: (id: string, date?: string, token?: string) => {
    let url = `${SHOP_URL}availability/${id}`;
    if (date) url += `?date=${date}`;

    return apiClient(url, "GET", undefined, token);
  },

  createShop: (body: any, token?: string) =>
    apiClient(`${SHOP_URL}create`, "POST", body, token),

  createShopAvailability: (body: any, token?: string) =>
    apiClient(`${SHOP_URL}availability`, "POST", body, token),

  getShopByBarberId: (id: string) =>
    apiClient(`${SHOP_URL}barber/${id}`, "GET"),
};
