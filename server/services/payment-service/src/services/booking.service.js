
const patchBookingStatus = async (bookingId, status, token) => {
    try {
        const res = await fetch(`${process.env.BOOKING_SERVICE_URL}/api/bookings/status/${bookingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error updating booking status:", error);
        return { message: 'Failed to connect to Booking service', error };
    }
}

module.exports = { patchBookingStatus };