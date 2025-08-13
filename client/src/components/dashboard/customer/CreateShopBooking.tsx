import type { Service } from "@/models/shop";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuList,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { isLoggedIn } from "@/utils/auth";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const CreateShopBooking = ({ onClose, shop }: any) => {
  const [date, setDate] = useState<string>();
  const [selectedDay, setSelectedDay] = useState<string>(
    dayjs().format("dddd")
  );
  const [shopServices, setShopServices] = useState<Record<string, Service>>({});
  const [selectedService, setSelectedService] = useState<string[]>([]);
  const [selectedServicePrice, setSelectedServicePrice] = useState<number[]>(
    []
  );
  const [selectedServiceTime, setSelectedServiceTime] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [slotDuration, setSlotDuration] = useState<number>(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [shopAvailability, setShopAvailability] = useState<any>([]);

  const shopId = shop?._id;
  const customerId = isLoggedIn()?.id;
  const token = isLoggedIn()?.token;

  const toast = useToast();

  const generateSlots = (): string[] => {
    if (slotDuration <= 0) return [];
    const slots = [];
    let current = dayjs(`2023-01-01T${startTime}`);
    const end = dayjs(`2023-01-01T${endTime}`);

    while (current.isBefore(end)) {
      slots.push(current.format("HH:mm"));
      current = current.add(slotDuration, "minute");
    }
    return slots;
  };

  const slots = generateSlots();

  const getShopServices = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/shops/list/${shopId}`
      );
      const data = await res.json();

      if (res.ok) {
        setShopServices(data.shop[0].services);
      } else {
        alert(data.message || "Failed to fetch shop services");
      }
    } catch (error) {
      alert("Error fetching shop services");
      console.error("Error fetching shop services:", error);
    }
  };

  const shopTimings = (bookingDay: string) => {
    const timings = shopAvailability[bookingDay];
    setStartTime(timings?.start);
    setEndTime(timings?.end);
  };

  const getShopAvailability = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }api/shops/availability/${shopId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      const data = await res.json();

      if (res.ok) {
        setShopAvailability(data.availability.day);
      } else {
        alert(data.message || "Failed to fetch shop availability");
      }
    } catch (error) {
      console.error("Error fetching shop availability:", error);
    }
  };

  useEffect(() => {
    getShopServices();
    getShopAvailability();
  }, []);

  useEffect(() => {
    const totalTime = selectedServiceTime.reduce(
      (accumulator, currentValue) => accumulator + parseInt(currentValue),
      0
    );
    setSlotDuration(totalTime);
    console.log("Total Slot Duration:", totalTime);
  }, [selectedServiceTime]);

  useEffect(() => {
    shopTimings(selectedDay);
  }, [date]);

  const toggleOption = (option: string) => {
    setSelectedService((prevServices) => {
      const index = prevServices.indexOf(option);

      if (index > -1) {
        setSelectedServicePrice((prevPrices) => {
          const updated = [...prevPrices];
          updated.splice(index, 1);
          return updated;
        });

        setSelectedServiceTime((prevTimes) => {
          const updated = [...prevTimes];
          updated.splice(index, 1);
          return updated;
        });

        const updatedServices = [...prevServices];
        updatedServices.splice(index, 1);
        return updatedServices;
      } else {
        setSelectedServicePrice((prevPrices) => [
          ...prevPrices,
          shopServices[option].price,
        ]);

        setSelectedServiceTime((prevTimes) => [
          ...prevTimes,
          shopServices[option].time,
        ]);

        return [...prevServices, option];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      toast({
        title: "Slot Not Selected",
        status: "warning",
        duration: 3000,
      });
    }

    try {
      console.log(selectedSlot?.toString());
      const timeSlot = {
        start: selectedSlot,
        end: dayjs(selectedSlot, "HH:mm")
          .add(slotDuration, "minute")
          .format("HH:mm"),
      };
      console.log(timeSlot);

      const bookingData = {
        shop_id: shopId,
        customer_id: customerId,
        date: date,
        time_slot: timeSlot,
        status: "booked",
        services: selectedService,
        amount: selectedServicePrice.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        ),
        payment_status: "pending",
      };

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/bookings/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(bookingData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast({
          title: data.message,
          status: "success",
          duration: 5000,
        });
      } else {
        toast({
          title: data.message,
          status: "error",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error booking slot:", error);
    }
  };
  return (
    <div>
      <ModalContent>
        <ModalHeader>Book Your Slot</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody pb={6}>
            <FormControl>
              <Flex gap={2} mb={4}>
                <Input
                  w="50%"
                  className="custom-input"
                  type="date"
                  placeholder="Select Date"
                  value={date}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    setDate(selectedDate);
                    const dayName = dayjs(selectedDate).format("dddd");
                    setSelectedDay(dayName);
                  }}
                  min={dayjs().format("YYYY-MM-DD")}
                  max={dayjs().add(7, "day").format("YYYY-MM-DD")}
                />
                <Menu closeOnSelect={false}>
                  <MenuButton
                    w="50%"
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                  >
                    {selectedService.length > 0
                      ? `${selectedService.length} selected`
                      : "Select services"}
                  </MenuButton>
                  <MenuList maxHeight="200px" overflowY="auto">
                    {Object.keys(shopServices).map((option) => (
                      <Box
                        key={option}
                        px={3}
                        py={2}
                        _hover={{ bg: "gray.100", cursor: "pointer" }}
                        onClick={() => toggleOption(option)}
                      >
                        <Checkbox
                          isChecked={selectedService.includes(option)}
                          pointerEvents="none"
                        >
                          {option} - ₹{shopServices[option].price} /{" "}
                          {shopServices[option].time} min
                        </Checkbox>
                      </Box>
                    ))}
                  </MenuList>
                </Menu>
              </Flex>
              <Flex gap={2} mb={4}>
                <Box className="flex flex-row" w="100%" gap={2}>
                  <Text w="50%">
                    <strong>Total Time: </strong>
                    {selectedServiceTime.reduce(
                      (accumulator, currentValue) =>
                        accumulator + parseInt(currentValue),
                      0
                    )}{" "}
                    min
                  </Text>
                  <Text w="50%">
                    <strong>Total Price: </strong>₹
                    {selectedServicePrice.reduce(
                      (accumulator, currentValue) => accumulator + currentValue,
                      0
                    )}
                  </Text>
                </Box>
              </Flex>
              <Flex>
                <Heading size="sm" mb={2}>
                  Select Your Desired Slot between {startTime} - {endTime}
                </Heading>
              </Flex>
              {slotDuration > 0 && (
                <SimpleGrid columns={4} spacing={3}>
                  {slots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedSlot === slot ? "solid" : "outline"}
                      colorScheme={selectedSlot === slot ? "blue" : "gray"}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </SimpleGrid>
              )}
              {selectedSlot && (
                <Text mt={4} fontWeight="bold" textAlign="center">
                  Selected Slot: {selectedSlot}
                </Text>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" className="submit-btn" mr={3}>
              Save
            </Button>
            <Button variant={"outline"} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </div>
  );
};

export default CreateShopBooking;
