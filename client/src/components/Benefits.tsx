import { Box, CheckIcon, Heading, Text } from "@chakra-ui/icons";
import image1 from "../assets/image1.jpg";
import "./Benefits.css";

interface BenefitsProps {
  id: number;
  title: string;
  description: string;
}

const BenefitsList: BenefitsProps[] = [
  {
    id: 1,
    title: "No More Waiting in Line",
    description:
      "Book your haircut in advance and walk in at your chosen time.",
  },
  {
    id: 2,
    title: "Multiple Services, One Platform",
    description:
      "From haircuts to grooming — explore all services in one place.",
  },
  {
    id: 3,
    title: "Hassle-Free Experience",
    description:
      "Easy scheduling, instant confirmations, and reminders so you never miss an appointment.",
  },
  {
    id: 4,
    title: "Grow Your Customer Base",
    description:
      "Get discovered by new customers searching for barber shops online.",
  },
  {
    id: 5,
    title: "Smart Booking Management",
    description:
      "Easily manage appointments, avoid overbooking, and keep your chairs full.",
  },
];

const Benefits = () => {
  return (
    <Box
      className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
      maxW={"7xl"}
    >
      <div className="flex flex-col gap-4 items-start">
        {BenefitsList.map(({ title, description }: BenefitsProps) => (
          <div className="rounded-sm w-full grid grid-cols-12 shadow p-3 gap-2 items-center hover:shadow-lg transition duration-300 ease-in-out hover:scale-105 transform">
            <div className="col-span-12 md:col-span-1">
              <CheckIcon />
            </div>
            <div className="col-span-11 xl:-ml-5">
              <Heading as={"h4"} className="font-semibold" fontSize={"lg"}>
                {title}
              </Heading>
            </div>
            <div className="md:col-start-2 col-span-11 xl:-ml-5">
              <Text className="description font-light" fontSize={"md"}>
                {description}
              </Text>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <img
          src={image1}
          alt="Benefits"
          className="w-full max-w-md rounded-lg"
        />
      </div>
    </Box>
  );
};

export default Benefits;
