import { Box, Heading, Container, Text, Button, Stack } from "@chakra-ui/react";

import "./Home.css";
import ShopsLanding from "@/components/ShopsLanding";
import Benefits from "@/components/Benefits";

const Home = () => {
  return (
    <>
      <Container maxW={"full"} px={0} mb="250">
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
              Find trusted barber shops near you, view availability, and book
              your slot instantly — no more waiting in line
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
        <Box maxW={"full"} className="flex flex-col items-center">
          <Benefits />
        </Box>
      </Container>
    </>
  );
};

export default Home;
