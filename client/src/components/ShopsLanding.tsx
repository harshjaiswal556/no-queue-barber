import type { Shop } from "@/models/shop";
import { Box, Heading, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import ShopsCard from "./ShopsCard";

import "./ShopsLanding.css";

const ShopsLanding = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const [shop, setShop] = useState<Shop[]>([]);
  const toast = useToast();

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
    <>
      <Box className="flex justify-center mb-12 mt-32">
        <Heading as={"h3"}>Our Stores</Heading>
      </Box>
      <div className="shops-slider">
        <Box w={"100%"} maxW={"7xl"}>
          <Slider {...settings}>
            {shop &&
              shop.map((shop, index) => (
                <ShopsCard shop={shop} isView={false} key={index} />
              ))}
          </Slider>
        </Box>
      </div>
    </>
  );
};

export default ShopsLanding;
