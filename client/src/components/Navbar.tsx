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
import Signup from "./authentication/Signup";

const Navbar = () => {
  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose,
  } = useDisclosure();
  const {
    isOpen: isSignupOpen,
    onOpen: onSignupOpen,
    onClose: onSignupClose,
  } = useDisclosure();

  return (
    <>
      <Box className="bg-white shadow-md">
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
          className="px-4 max-w-7xl mx-auto"
        >
          <Box className="text-xl font-bold text-black-600">NoQueueBarber</Box>

          <Flex display={{ base: "none", md: "flex" }} gap={6}>
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link href="#" className="nav-link">
              Services
            </Link>
            <Link href="#" className="nav-link">
              Contact
            </Link>
          </Flex>

          <Flex display={{ base: "none", md: "flex" }} gap={4}>
            <Button variant="outline" onClick={onLoginOpen}>
              Login
            </Button>
            <Button className="sign-up-btn" onClick={onSignupOpen}>
              Sign Up
            </Button>
          </Flex>

          <IconButton
            size="md"
            icon={isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={isMenuOpen ? onMenuClose : onMenuOpen}
          />
        </Flex>

        {/* Mobile Menu */}
        {isMenuOpen && (
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
              <Button variant="outline" onClick={onLoginOpen}>
                Login
              </Button>
              <Button className="sign-up-btn" onClick={onSignupOpen}>
                Sign Up
              </Button>
            </Stack>
          </Box>
        )}
      </Box>

      <Modal isOpen={isLoginOpen} onClose={onLoginClose}>
        <ModalOverlay />
        <Login onClose={onLoginClose} />
      </Modal>

      <Modal size={"4xl"} isOpen={isSignupOpen} onClose={onSignupClose}>
        <ModalOverlay />
        <Signup onClose={onSignupClose} />
      </Modal>
    </>
  );
};

export default Navbar;
