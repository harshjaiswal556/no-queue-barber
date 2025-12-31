import { apiClient } from "./apiClient";

const BASE_URL = import.meta.env.VITE_SERVER_BOOKING_SERVICE_URL;
const BOOKING_URL = `${BASE_URL}/api/v1/bookings`;

export const bookingsAPI = {
  cancelBookingByBookingId: (id: string, token?: string) =>
    apiClient(`${BOOKING_URL}/cancel/${id}`, "PUT", undefined, token),

  getBookingByCustomerId: (
    id: string,
    token?: string,
    queryString?: string
  ) => {
    if (queryString) {
      return apiClient(
        `${BOOKING_URL}/list/customer/${id}${queryString}`,
        "GET",
        undefined,
        token
      );
    }
    return apiClient(
      `${BOOKING_URL}/list/customer/${id}`,
      "GET",
      undefined,
      token
    );
  },

  createBooking: (body: any, token?: string) =>
    apiClient(`${BOOKING_URL}/create`, "POST", body, token),
};
