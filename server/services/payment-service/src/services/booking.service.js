
const patchBookingStatus = async (bookingId, payment_status, token) => {
    try {
        console.log(bookingId, payment_status);

        const res = await fetch(`${process.env.BOOKING_SERVICE_URL}/api/v1/bookings/status/${bookingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ payment_status })
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error updating booking status:", error);
        return { message: 'Failed to connect to Booking service', error };
    }
}

module.exports = { patchBookingStatus };