import { apiClient } from "./apiClient";

const PAYMENT_URL = "api/payment/";

export const paymentAPI = {
  createOrder: (id: string | undefined, body: any, token?: string) =>
    apiClient(`${PAYMENT_URL}create-order/${id}`, "POST", body, token),
  verifyPayment: (body: any, token?: string) =>
    apiClient(`${PAYMENT_URL}verify-and-update`, "POST", body, token),
};
