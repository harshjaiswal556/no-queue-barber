import type { Shop } from "@/models/shop";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

import "./ShopsCard.css";
import Cookies from "js-cookie";

const ShopsCard = ({ shop }: { shop: Shop | null }) => {
  const role = Cookies.get("role");

  return (
    <div>
      <Card maxW={300} m={5} className="shop-list-card">
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
            <Text>{shop?.address}</Text>
          </Stack>
        </CardBody>
        {role !== "barber" && (
          <CardFooter>
            <ButtonGroup spacing="2" className="w-[100%]">
              <Button variant="solid" className="submit-btn w-[100%]">
                Book My Slot Now
              </Button>
            </ButtonGroup>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ShopsCard;
