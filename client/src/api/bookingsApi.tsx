import { apiClient } from "./apiClient";

const BOOKING_URL = "api/bookings/";

export const bookingsAPI = {
  cancelBookingByBookingId: (id: string, token?: string) =>
    apiClient(`${BOOKING_URL}/cancel/${id}`, "PUT", undefined, token),

  getBookingByCustomerId: (id: string, token?: string) =>
    apiClient(`${BOOKING_URL}list/customer/${id}`, "GET", undefined, token),

  createBooking: (body: any, token?: string) =>
    apiClient(`${BOOKING_URL}create`, "POST", body, token),
};
