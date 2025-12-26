const findAvailabilityByShopId = async (shopId) => {
    try {
        const res = await fetch(`${process.env.AVAILABILITY_SERVICE_URL}/api/v1/availability/${shopId}`, {
            method: 'GET'
        });
        return res.json();
    } catch (error) {
        console.log(error);
        return { message: 'Something went wrong', error }
    }
}

module.exports = { findAvailabilityByShopId }