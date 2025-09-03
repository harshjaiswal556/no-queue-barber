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
  useToast,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const MyBookingCard = ({ bookingDetails }: any) => {
  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();

  const {
    isOpen: isCancelOpen,
    onOpen: onCancelOpen,
    onClose: onCancelClose,
  } = useDisclosure();

  const [shop, setShop] = useState<Shop>();
  const toast = useToast();

  const token = Cookies.get("token");

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

  const handleCancelSubmit = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/bookings/cancel/${bookingDetails._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast({
          title: data.message,
          status: "success",
          duration: 3000,
        });
        onCancelClose();
        window.location.reload();
      } else {
        toast({
          title: data.message,
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
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
          top="19px"
          left="-30px"
          zIndex={2}
          borderRadius="md"
          px={3}
          py={1}
          transform="rotate(-45deg)"
          textAlign="center"
          fontWeight="semibold"
          w="125px"
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
          <CardBody pb={1}>
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

          <CardFooter className="flex flex-wrap">
            {bookingDetails && bookingDetails?.status!=='cancelled' ? (
              bookingDetails.payment_status === "pending" ? (
                <Button
                  variant="solid"
                  className="submit-btn m-1"
                >
                  Pay Now
                </Button>
              ) : (
                <Button variant="outline" className="cursor-default m-1">
                  Paid
                </Button>
              )
            ) : null}
            <Button
              variant="solid"
              className="submit-btn m-1"
              onClick={onMenuOpen}
            >
              Shop Details
            </Button>
            {bookingDetails?.status === "completed" || bookingDetails?.status === "cancelled" ? (
              null
            ) : <Button variant="solid" className="submit-btn m-1" onClick={onCancelOpen}>
              Cancel Booking
            </Button>
            }
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

      <Modal isOpen={isCancelOpen} onClose={onCancelClose} size={"md"}>
        <ModalOverlay />
        <ModalContent w={310} className="p-6">
          <Text className="mb-4">
            Are you sure you want to cancel this booking?
          </Text>
          <div className="flex justify-between gap-4">
            <Button variant="outline" onClick={onCancelClose}>
              No
            </Button>
            <Button className="submit-btn" onClick={handleCancelSubmit}>Yes, Cancel it</Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyBookingCard;
