import CreateShop from "../../components/dashboard/barber/CreateShop";
import { Box, Heading, Text, Button, useDisclosure, Modal, ModalOverlay } from "@chakra-ui/react";

const Barber = () => {

  const {isOpen: isShopOpen, onOpen: onShopOpen,onClose: onShopClose} = useDisclosure();

  return (
    <div>
      <Box className="bg-white p-6 mx-auto text-center">
        <Heading as="h2" size="lg" mb={4} color="#000">
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

      <Modal isOpen={isShopOpen} onClose={onShopClose} size={"4xl"}>
        <ModalOverlay/>
        <CreateShop onClose={onShopClose} />
      </Modal>
    </div>
  );
};

export default Barber;
