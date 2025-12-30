const findUserById = async (userId) => {
    try {
        const res = await fetch(`${process.env.USER_SERVICE_URL}/api/v1/users/${userId}`, {
            method: 'GET'
        });
        return res.json();
    } catch (error) {
        console.log(error);
        return { message: 'Something went wrong', error }
    }
}

module.exports = { findUserById }