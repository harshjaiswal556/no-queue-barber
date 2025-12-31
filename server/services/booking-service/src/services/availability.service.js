const findAvailabilityByShopId = async (shopId, token) => {
    try {
        const res = await fetch(`${process.env.AVAILABILITY_SERVICE_URL}/api/v1/availability/${shopId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (res.status === 404) {
            return { status: 404, message: 'Shop availability not found' };
        }
        if (!res.ok) {
            return { status: res.status, message: 'Something went wrong' };
        }
        return res.json();
    } catch (error) {
        console.log(error);
        return { message: 'Something went wrong', error }
    }
}

module.exports = { findAvailabilityByShopId }