import { apiClient } from "./apiClient";
const BASE_URL = import.meta.env.VITE_SERVER_PAYMENT_SERVICE_URL;
const PAYMENT_URL = `${BASE_URL}/api/v1/payment/`;

export const paymentAPI = {
  createOrder: (id: string | undefined, body: any, token?: string) =>
    apiClient(`${PAYMENT_URL}create-order/${id}`, "POST", body, token),
  verifyPayment: (body: any, token?: string) =>
    apiClient(`${PAYMENT_URL}verify-and-update`, "POST", body, token),
  updatePaymentStatus: (id: string, token?: string) =>
    apiClient(
      `${PAYMENT_URL}payment-status/update/${id}`,
      "PUT",
      undefined,
      token
    ),
};
