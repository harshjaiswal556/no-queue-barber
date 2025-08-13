import Filters from "@/components/Filters";
import ShopsCard from "@/components/ShopsCard";
import type { Shop } from "@/models/shop";
import { Box, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Stores = () => {
  const [shop, setShop] = useState<Shop[]>([]);
  const toast = useToast();

  const handleShopDataFromChild = (data: any) => {
    setShop(data);
  };

  const fetchAllShops = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/shops/list`
      );
      const data = await res.json();
      if (res.ok) {
        setShop(data.shops);
      } else {
        toast({
          title: "Error while loading shops",
          duration: 5000,
          status: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllShops();
  }, []);
  return (
    <div className="mt-32">
      <Box
        mx={{
          base: 4,
          sm: 6,
          md: 12,
          lg: 16,
        }}
      >
        <Filters sendShopDataToParent={handleShopDataFromChild} />
      </Box>
      <Box
        className="flex justify-start flex-wrap"
        mx={{
          base: 4,
          sm: 6,
          md: 12,
          lg: 16,
        }}
      >
        {shop &&
          shop.map((shop, index) => (
            <ShopsCard shop={shop} isView={false} key={index} />
          ))}
      </Box>
    </div>
  );
};

export default Stores;
