const findBookingByShopId = async (shopId, date) => {
    try {
        // Construct URL with Query Parameters for date and status
        const baseUrl = `${process.env.BOOKING_SERVICE_URL}/api/bookings/list/shop/${shopId}`;
        const queryParams = `?date=${date}&status=booked,confirmed`;

        const res = await fetch(`${baseUrl}${queryParams}`, {
            method: 'GET'
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to fetch bookings');
        }

        return data;
    } catch (error) {
        console.error("Error in findBookingByShopId:", error.message);
        return { message: 'Something went wrong', error: error.message };
    }
}

module.exports = { findBookingByShopId };