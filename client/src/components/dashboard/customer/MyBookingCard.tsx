import ShopsCard from "@/components/ShopsCard";
import type { Shop } from "@/models/shop";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  Stack,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const MyBookingCard = ({ bookingDetails }: any) => {
  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();
  const [shop, setShop] = useState<Shop>();

  console.log(bookingDetails);

  const getShopDetailsByShopId = async (shopId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/shops/list/${shopId}`
      );
      const data = await res.json();

      if (res.ok) {
        setShop(data.shop[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const shopId = bookingDetails?.shop_id;
    getShopDetailsByShopId(shopId);
  }, [bookingDetails]);
  return (
    <>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        maxW={720}
      >
        <Badge
          position="absolute"
          top="12px"
          left="-35px"
          zIndex={2}
          borderRadius="md"
          px={3}
          py={1}
          transform="rotate(-45deg)"
          textAlign="center"
          fontWeight="semibold"
          w="120px"
        >
          {bookingDetails?.status}
        </Badge>
        {shop?.imageUrl && (
          <Image
            objectFit="cover"
            maxW={{ base: "100%", sm: "200px" }}
            src={shop?.imageUrl}
            alt={shop?.shopName}
          />
        )}
        {!shop?.imageUrl && (
          <Image
            objectFit="cover"
            maxW={{ base: "100%", sm: "200px" }}
            src="https://png.pngtree.com/png-clipart/20190705/original/pngtree-black-and-white-barber-shop-logo-png-image_4359640.jpg"
            alt={shop?.shopName}
          />
        )}

        <Stack>
          <CardBody>
            <Heading size="md" mb={2}>
              {shop?.shopName}
            </Heading>

            {bookingDetails?.services.map((service: string, index: number) => (
              <Tag mr={2} py={1} px={2} key={index}>
                {service}
              </Tag>
            ))}

            <Text mt={2}>
              <strong>Your Slot Date/Time:</strong>{" "}
              {dayjs(bookingDetails?.date).format("YYYY-MM-DD")} &#40;
              {bookingDetails?.time_slot.start} -{" "}
              {bookingDetails?.time_slot.end}&#41;
            </Text>
            <Text>
              <strong>Total Amount:</strong> ₹{bookingDetails?.amount}
            </Text>
          </CardBody>

          <CardFooter>
            {bookingDetails ? (
              bookingDetails.payment_status === "pending" ? (
                <Button
                  variant="solid"
                  className="submit-btn mx-2"
                  onClick={onMenuOpen}
                >
                  Pay Now
                </Button>
              ) : (
                <Button variant="outline" className="cursor-default mx-2">
                  Paid
                </Button>
              )
            ) : null}
            <Button
              variant="solid"
              className="submit-btn mx-2"
              onClick={onMenuOpen}
            >
              Shop Details
            </Button>
            <Button variant="solid" className="submit-btn mx-2">
              Cancel Booking
            </Button>
          </CardFooter>
        </Stack>
      </Card>

      <Modal isOpen={isMenuOpen} onClose={onMenuClose} size={"md"}>
        <ModalOverlay />
        <ModalContent w={310}>
          {shop && <ShopsCard shop={shop} isView={true} />}
          <Button onClick={onMenuClose}>Close</Button>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyBookingCard;
