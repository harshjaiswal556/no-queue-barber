const findBookingByShopId = async (shopId, date, token) => {
    try {

        // Construct URL with Query Parameters for date and status
        const baseUrl = `${process.env.BOOKING_SERVICE_URL}/api/v1/bookings/list/shop/${shopId.shop_id}`;
        const queryParams = `?date=${date}&status=booked,confirmed`;

        const res = await fetch(`${baseUrl}${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data = await res.json();

        if (res.status === 404) {
            return { bookings: [], message: 'No bookings found' };
        }

        return data;
    } catch (error) {
        console.error("Error in findBookingByShopId:", error.message);
        return { message: 'Something went wrong', error: error.message };
    }
}

module.exports = { findBookingByShopId };