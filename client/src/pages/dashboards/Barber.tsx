import ShopListingCard from "@/components/dashboard/barber/ShopListingCard";
import CreateShop from "../../components/dashboard/barber/CreateShop";
import type { Shop } from "@/models/shop";
import type { RootState } from "@/store/auth/authStore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Heading,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";

import "./Barber.css";

const Barber = () => {
  const {
    isOpen: isShopOpen,
    onOpen: onShopOpen,
    onClose: onShopClose,
  } = useDisclosure();

  const [shop, setShop] = useState<Shop[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  const toast = useToast();

  const fetchBarberShops = async (userId: string | undefined) => {
    try {
      if (userId === undefined) {
        toast({
          title: "User is not logged in",
          duration: 3000,
          status: "error",
        });
        return;
      }
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/shops/barber/${userId}`
      );
      const data = await res.json();
      setShop(data.shops);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBarberShops(user?._id);
  }, []);

  return (
    <div>
      <Box
        className="hero-dashboard p-6 pt-0 mx-auto text-center h-[110vh] flex flex-col items-center justify-center"
        mt={-16}
      >
        <Heading
          as="h1"
          size="xl"
          mb={4}
          color="var(--primary-foreground-color)"
        >
          Welcome to Our Service
        </Heading>

        <Text fontSize="md" color="gray.600" mb={6}>
          We provide high-quality solutions to help your business grow and
          succeed in the digital world.
        </Text>

        <Button className="submit-btn" size="lg" onClick={onShopOpen}>
          Add Your Shop
        </Button>
      </Box>

      <Box className="bg-white p-6 mx-auto">
        <Heading
          as="h2"
          size={"lg"}
          m={16}
          color={"var(--primary-foreground-color)"}
          className="text-center"
        >
          My Listed Shops
        </Heading>
        <Box
          mx={{
            base: 4,
            sm: 6,
            md: 12,
            lg: 16,
          }}
        >
          {shop?.map((shop) => (
            <ShopListingCard key={shop._id} shop={shop} />
          ))}
        </Box>
      </Box>

      <Modal isOpen={isShopOpen} onClose={onShopClose} size={"4xl"}>
        <ModalOverlay />
        <CreateShop onClose={onShopClose} />
      </Modal>
    </div>
  );
};

export default Barber;
