import type { Shop } from "@/models/shop";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import "./ShopListingCard.css";

const ShopListingCard = ({ shop }: { shop: Shop | null }) => {
  console.log(shop);

  return (
    <>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        className="my-8"
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
          alt="Caffe Latte"
        />

        <Stack>
          <CardBody>
            <Heading size="md">{shop?.shopName}</Heading>

            <Text py="2">
              {shop?.address} - <span className="zipcode">{shop?.zipcode}</span>
            </Text>
          </CardBody>

          <CardFooter>
            <Button variant="solid" className="submit-btn">
              Add Availability
            </Button>
          </CardFooter>
        </Stack>
      </Card>
    </>
  );
};

export default ShopListingCard;
