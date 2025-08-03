import type { Shop } from "@/models/shop";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Modal,
  ModalOverlay,
  Stack,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import "./ShopListingCard.css";
import CreateShopAvailability from "./CreateShopAvailability";

const ShopListingCard = ({ shop }: { shop: Shop | null }) => {
  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();

  return (
    <>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        className="my-8"
      >
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
            <Heading size="md">{shop?.shopName}</Heading>

            <Text py="2">
              {shop?.address} - <span className="zipcode">{shop?.zipcode}</span>
            </Text>

            {shop?.services &&
              Object.keys(shop.services).map((key) => (
                <Tag key={key} mr={2} py={1} px={2}>
                  {key} - ₹{shop.services[key].price} /{" "}
                  {shop.services[key].time} min
                </Tag>
              ))}

            <Text mt={2}>
              <strong>Timings:</strong> {shop?.workingHours.start} -{" "}
              {shop?.workingHours.end}
            </Text>
          </CardBody>

          <CardFooter>
            <Button variant="solid" className="submit-btn" onClick={onMenuOpen}>
              Add Availability
            </Button>
          </CardFooter>
        </Stack>
      </Card>

      <Modal isOpen={isMenuOpen} onClose={onMenuClose} size={"md"}>
        <ModalOverlay />
        <CreateShopAvailability
          onClose={onMenuClose}
          shopId={shop?._id}
          start={shop?.workingHours.start}
          end={shop?.workingHours.end}
        />
      </Modal>
    </>
  );
};

export default ShopListingCard;
