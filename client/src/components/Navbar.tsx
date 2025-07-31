import {
  Box,
  Flex,
  Button,
  IconButton,
  useDisclosure,
  Stack,
  Link,
  Modal,
  ModalOverlay,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import "./Navbar.css";
import Login from "./authentication/Login";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box className="bg-white shadow-md">
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
          className="px-4 max-w-7xl mx-auto"
        >
          {/* Logo */}
          <Box className="text-xl font-bold text-black-600">NoQueueBarber</Box>

          {/* Desktop Menu */}
          <Flex display={{ base: "none", md: "flex" }} gap={6}>
            <Link href="#" className="nav-link">
              About
            </Link>
            <Link href="#" className="nav-link">
              Home
            </Link>
            <Link href="#" className="nav-link">
              Services
            </Link>
            <Link href="#" className="nav-link">
              Contact
            </Link>
          </Flex>

          {/* Right Buttons */}
          <Flex display={{ base: "none", md: "flex" }} gap={4}>
            <Button variant="outline">Login</Button>
            <Button className="sign-up-btn" onClick={onOpen}>
              Sign Up
            </Button>
          </Flex>

          {/* Mobile Menu Button */}
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
        </Flex>

        {/* Mobile Menu */}
        {isOpen && (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as="nav" spacing={4} className="px-4">
              <Link href="#" className="nav-link">
                Home
              </Link>
              <Link href="#" className="nav-link">
                About
              </Link>
              <Link href="#" className="nav-link">
                Services
              </Link>
              <Link href="#" className="nav-link">
                Contact
              </Link>
              <Button variant="outline">Login</Button>
              <Button className="sign-up-btn">Sign Up</Button>
            </Stack>
          </Box>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <Login onClose={onClose} />
      </Modal>
    </>
  );
};

export default Navbar;
