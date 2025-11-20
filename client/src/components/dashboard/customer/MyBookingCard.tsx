import { bookingsAPI } from "@/api/bookingsApi";
import { paymentAPI } from "@/api/payment";
import { shopAPI } from "@/api/shopsApi";
import ShopsCard from "@/components/ShopsCard";
import type { Shop } from "@/models/shop";
import { isLoggedIn } from "@/utils/auth";
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

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  const user = isLoggedIn();

  const getShopDetailsByShopId = async (shopId: string) => {
    try {
      const data = await shopAPI.getShopById(shopId);

      if (data.ok) {
        setShop(data.data.shop[0]);
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
      const data = await bookingsAPI.cancelBookingByBookingId(
        bookingDetails._id,
        token
      );
      if (data.ok) {
        toast({
          title: data.data.message,
          status: "success",
          duration: 3000,
        });
        onCancelClose();
        window.location.reload();
      } else {
        toast({
          title: data.data.message,
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createOrder = async () => {
    const createOrderData = {
      booking_id: bookingDetails._id,
      amount: bookingDetails.amount,
      currency: "INR",
    };

    const data = await paymentAPI.createOrder(user?.id, createOrderData, token);

    if (data.ok) {
      openRazorpayCheckout(data.data.razorpayOrder);
    } else {
      alert("Order creation failed");
    }
  };
  const openRazorpayCheckout = (orderData: any) => {
    const options = {
      key: import.meta.env.VITE_SERVER_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "NoQueueBarber",
      description: "Payment for Barber Shop",
      order_id: orderData.id,

      handler: async function (response: any) {
        try {
          const verifyPaymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          // const verifyData = await verifyRes.json();
          const verifyData = await paymentAPI.verifyPayment(
            verifyPaymentData,
            token
          );
          alert(verifyData.data.message);
        } catch (error) {
          console.error("Error verifying payment:", error);
          alert("Payment succeeded but verification failed.");
        }
      },

      prefill: {
        name: "User Name",
        email: "user@example.com",
      },
      theme: {
        color: "#6366f1",
      },
    };

    const razor = new window.Razorpay(options);

    razor.on("payment.failed", function (response: any) {
      alert("Payment failed: " + response.error.description);
      console.error(response.error);
    });

    razor.open();
  };

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
            {bookingDetails && bookingDetails?.status === "booked" ? (
              bookingDetails.payment_status === "pending" ? (
                <Button
                  variant="solid"
                  className="submit-btn m-1"
                  onClick={createOrder}
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
            {bookingDetails?.status === "completed" ||
            bookingDetails?.status === "cancelled" ? null : (
              <Button
                variant="solid"
                className="submit-btn m-1"
                onClick={onCancelOpen}
              >
                Cancel Booking
              </Button>
            )}
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
            <Button className="submit-btn" onClick={handleCancelSubmit}>
              Yes, Cancel it
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyBookingCard;
