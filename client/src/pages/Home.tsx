import { Box, Heading, Container, Text, Button, Stack } from "@chakra-ui/react";

import "./Home.css";
import ShopsLanding from "@/components/ShopsLanding";
import Benefits from "@/components/Benefits";
import { isLoggedIn } from "@/utils/auth";

const Home = () => {
  const role = isLoggedIn()?.role;
  return (
    <Container maxW={"full"} px={0}>
      <div className="home-hero p-6 pt-0 mx-auto text-center h-[100vh] flex flex-col items-center justify-center">
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
          maxW={"7xl"}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
            as={"h1"}
          >
            Skip the Queue <br />
            <Text as={"span"} className="heding-desc">
              Book Your Haircut Online
            </Text>
          </Heading>
          <Text
            className="hero-description"
            fontSize={{ base: "sm", sm: "md", md: "xl" }}
          >
            Find trusted barber shops near you, view availability, and book your
            slot instantly — no more waiting in line
          </Text>
          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <Button variant={"solid"} className="submit-btn">
              Join NoQueueBarber
            </Button>
          </Stack>
        </Stack>
      </div>

      <ShopsLanding />
      <div className="mt-32 mb-16 flex flex-row justify-center">
        <Heading as={"h3"}>Why Choose NoQueueBarber</Heading>
      </div>
      <Box className="flex flex-col items-center px-4 mx-auto">
        <Benefits />
      </Box>
      {role !== "customer" && (
        <Box maxW={"full"} className="flex flex-col items-center mt-32 mx-12">
          <Box className="flex justify-center items-center flex-col">
            <Heading as={"h4"} fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
              <i>
                “Are you a barber? Grow your business with our booking
                platform.”
              </i>
            </Heading>
            <Button className="submit-btn mt-8" variant={"solid"}>
              Register Your Shop
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Home;
