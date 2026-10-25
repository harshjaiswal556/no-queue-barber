const searchShopsByName = async (shopName) => {
  try {
    const res = await fetch(`${process.env.SHOP_SERVICE_URL}/api/v1/shop/search?shopName=${encodeURIComponent(shopName)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return { status: res.status, shops: [] };
    }
    const data = await res.json();
    return { status: 200, shops: data.shops };
  } catch (error) {
    console.error('Error searching shops:', error);
    return { status: 500, shops: [] };
  }
};

module.exports = { searchShopsByName };
