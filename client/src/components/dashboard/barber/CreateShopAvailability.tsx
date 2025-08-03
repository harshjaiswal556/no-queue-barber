import { isLoggedIn } from "@/utils/auth";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import TimePicker from "react-time-picker";

const CreateShopAvailability = ({ onClose, shopId, start, end }: any) => {
  const user = isLoggedIn();
  const toast = useToast();

  const [open, setOpen] = useState<string[]>(Array(7).fill(start));
  const [close, setClose] = useState<string[]>(Array(7).fill(end));
  const [seats, setSeats] = useState<number>();

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  //   const isAvailabilityPresent = () =>{

  //   }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user || !shopId) {
        return;
      }

      const dayAvailability: Record<string, { start: string; end: string }> =
        {};

      days.forEach((day, index) => {
        dayAvailability[day] = {
          start: open[index] || "",
          end: close[index] || "",
        };
      });

      const availabilityData = {
        barber_id: user?.id,
        shop_id: shopId,
        day: dayAvailability,
        totalChairs: seats,
      };

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/shops/availability`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: JSON.stringify(availabilityData),
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
      console.error(error);
    }
  };
  return (
    <ModalContent>
      <form onSubmit={handleSubmit}>
        <ModalHeader>Add Shop Availability Day Wise</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            {days.map((day, index) => (
              <Flex gap={2} className="flex items-center mb-2" key={day}>
                <Box w={"90px"}>
                  <Text fontWeight={"bold"}>{day}</Text>
                </Box>

                <Box className="input-time shop-input bg-white rounded">
                  <Text>Open</Text>
                  <TimePicker
                    className="w-full custom-timepicker"
                    disableClock
                    clearIcon={null}
                    value={open[index] || ""}
                    onChange={(value: string | null) => {
                      const newOpen = [...open];
                      newOpen[index] = value || "";
                      setOpen(newOpen);
                    }}
                  />
                </Box>

                <Box className="input-time shop-input bg-white rounded">
                  <Text>Close</Text>
                  <TimePicker
                    className="w-full custom-timepicker"
                    disableClock
                    clearIcon={null}
                    value={close[index] || ""}
                    onChange={(value: string | null) => {
                      const newClose = [...close];
                      newClose[index] = value || "";
                      setClose(newClose);
                    }}
                  />
                </Box>
              </Flex>
            ))}

            <Flex className="flex items-center">
              <Box w={130}>
                <FormLabel fontWeight={"bold"}>Total Seats</FormLabel>
              </Box>
              <Input
                type="number"
                className="shop-input"
                placeholder="Enter Shop Address"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
              />
            </Flex>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button type="submit" className="submit-btn" mr={3}>
            Save
          </Button>
          <Button variant="outline" onClick={onClose} className="cancel-btn">
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};

export default CreateShopAvailability;
