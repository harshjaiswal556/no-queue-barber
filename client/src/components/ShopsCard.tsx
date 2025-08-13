import type { Shop } from "@/models/shop";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Modal,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import "./ShopsCard.css";
import Cookies from "js-cookie";
import CreateShopBooking from "./dashboard/customer/CreateShopBooking";

const ShopsCard = ({
  shop,
  isView,
}: {
  shop: Shop | null;
  isView: boolean;
}) => {
  const role = Cookies.get("role");

  const {
    isOpen: isShopOpen,
    onOpen: onShopOpen,
    onClose: onShopClose,
  } = useDisclosure();

  return (
    <div>
      <Card
        maxW={300}
        m={5}
        className={!isView ? "shop-list-card" : "isview-shop-list-card"}
      >
        <CardBody>
          <div className="image-wrapper">
            <Image
              src={
                shop?.imageUrl ||
                "https://png.pngtree.com/png-clipart/20190705/original/pngtree-black-and-white-barber-shop-logo-png-image_4359640.jpg"
              }
              alt={shop?.shopName}
              borderRadius="lg"
              className="shop-image"
            />
          </div>
          <Stack mt="6" spacing="3">
            <Heading size="md">{shop?.shopName}</Heading>
            <Text>
              {shop?.address} - {shop?.zipcode}
            </Text>
          </Stack>
        </CardBody>
        {role !== "barber" && !isView && (
          <CardFooter>
            <ButtonGroup spacing="2" className="w-[100%]">
              <Button
                variant="solid"
                className="submit-btn w-[100%]"
                onClick={onShopOpen}
              >
                Book My Slot Now
              </Button>
            </ButtonGroup>
          </CardFooter>
        )}
      </Card>
      <Modal isOpen={isShopOpen} onClose={onShopClose}>
        <ModalOverlay />
        <CreateShopBooking onClose={onShopClose} shop={shop} />
      </Modal>
    </div>
  );
};

export default ShopsCard;
