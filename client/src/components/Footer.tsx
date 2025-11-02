"use client";

import { EmailIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Input,
  IconButton,
  Heading,
  List,
} from "@chakra-ui/react";

import "./Footer.css";

const Footer = () => {
  return (
    <Box className="footer-container">
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid
          templateColumns={{ sm: "1fr 1fr", md: "2fr 1fr 1fr 2fr" }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box className="text-3xl font-bold text-black-600">
              NoQueueBarber
            </Box>
            <Text fontSize={"sm"}>© 2025 NoQueueBarber. Created By Harsh</Text>
            {/* <Stack direction={"row"} spacing={6}>
              <SocialButton label={"Twitter"} href={"#"}>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={"YouTube"} href={"#"}>
                <FaYoutube />
              </SocialButton>
              <SocialButton label={"Instagram"} href={"#"}>
                <FaInstagram />
              </SocialButton>
            </Stack> */}
          </Stack>
          <Stack align={"flex-start"}>
            <Heading as={"h4"} size={"md"} mb={5}>
              Company
            </Heading>
            <List className="footer-list">
              <Box as="a" href={"#"} mb={2}>
                About us
              </Box>
              <Box as="a" href={"#"} mb={2}>
                Blog
              </Box>
              <Box as="a" href={"#"} mb={2}>
                Contact us
              </Box>
              <Box as="a" href={"#"} mb={2}>
                Pricing
              </Box>
              <Box as="a" href={"#"} mb={2}>
                Testimonials
              </Box>
            </List>
          </Stack>
          <Stack align={"flex-start"}>
            <Heading as={"h4"} size={"md"} mb={5}>
              Support
            </Heading>
            <List className="footer-list">
              <Box as="a" href={"#"} mb={2}>
                Help Center
              </Box>
              <Box as="a" href={"#"} mb={2}>
                Terms of Service
              </Box>
              <Box as="a" href={"#"} mb={2}>
                Legal
              </Box>
              <Box as="a" href={"#"} mb={2}>
                Privacy Policy
              </Box>
              <Box as="a" href={"#"} mb={2}>
                Satus
              </Box>
            </List>
          </Stack>
          <Stack align={"flex-start"}>
            <Heading as={"h4"} size={"md"} mb={5}>
              Stay Up To Date
            </Heading>
            <Stack direction={"row"}>
              <Input
                placeholder={"Your email address"}
                className="custom-input footer-input"
              />
              <IconButton
                className="footer-input-icon"
                variant={"outline"}
                aria-label="Subscribe"
                icon={<EmailIcon />}
              />
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Footer;
