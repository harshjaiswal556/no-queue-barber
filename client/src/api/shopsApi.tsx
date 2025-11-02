import { apiClient } from "./apiClient";

const SHOP_URL = "api/shops/";

export const shopAPI = {
  getAllShops: () => apiClient(`${SHOP_URL}list?limit=6`, "GET"),

  getShopById: (id: string) => apiClient(`${SHOP_URL}list/${id}`, "GET"),

  getShopAvailabilityByShopId: (id: string, date?: string, token?: string) => {
    let url = `${SHOP_URL}availability/${id}`;
    if (date) url += `?date=${date}`;

    return apiClient(url, "GET", undefined, token);
  },
};
