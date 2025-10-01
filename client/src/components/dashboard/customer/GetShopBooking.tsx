import type { Bookings } from "@/models/bookings";
import { isLoggedIn } from "@/utils/auth";
import {
  Box,
  Button,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import MyBookingCard from "./MyBookingCard";
import Search from "@/components/Search";

const GetShopBooking = () => {
  const [myBookings, setMyBookings] = useState<Bookings[]>();
  const [status, setStatus] = useState<string | null>();
  const [loading, setLoading] = useState<Boolean>(false);

  const token = Cookies.get("token");

  const toast = useToast();

  const fetchBookingByCustomerId = async (customerId: string, role: string) => {
    try {
      if (role !== "customer") {
        toast({
          title: "Customer can only view their bookings",
          status: "warning",
          duration: 5000,
        });
        return;
      }
      setLoading(true);
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }api/bookings/list/customer/${customerId}`,
        {
          credentials: "include",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (!res.ok) {
        toast({
          title: data.message,
          status: "error",
          duration: 5000,
        });
        setLoading(false);
      } else {
        setMyBookings(data.bookings);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filterBookingByStatus = (status: string | null) => {
    setStatus(status);
  };

  useEffect(() => {
    const customerId = isLoggedIn()?.id;
    const role = isLoggedIn()?.role;
    if (!customerId || !role) {
      toast({
        title: "Error fetching data",
        status: "error",
        duration: 5000,
      });
      return;
    }
    fetchBookingByCustomerId(customerId, role);
  }, []);

  const handleSearchData = (data: any) => {
    setMyBookings(data);
  };

  return (
    <div>
      <Box className="flex flex-wrap items-center gap-4">
        <Box minW="350px" flex="1">
          <Search
            sendSearchDataToParent={handleSearchData}
            isCustomerBooking={true}
          />
        </Box>
        <Box className="flex flex-wrap">
          <Button
            m={2}
            px={{ lg: 6, sm: 3, base: 2 }}
            variant={"outline"}
            disabled={status === "booked"}
            onClick={() => filterBookingByStatus("booked")}
          >
            Upcoming
          </Button>
          <Button
            m={2}
            px={{ lg: 6, sm: 3, base: 2 }}
            variant={"outline"}
            disabled={status === "cancelled"}
            onClick={() => filterBookingByStatus("cancelled")}
          >
            Cancelled
          </Button>
          <Button
            m={2}
            px={{ lg: 6, sm: 3, base: 2 }}
            variant={"outline"}
            disabled={status === "completed"}
            onClick={() => filterBookingByStatus("completed")}
          >
            Completed
          </Button>
          <Button
            m={2}
            px={{ lg: 6, sm: 3, base: 2 }}
            variant={"outline"}
            onClick={() => filterBookingByStatus(null)}
          >
            Clear Status
          </Button>
        </Box>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} spacing={4} mt={8}>
        {myBookings ? (
          myBookings
            .filter((booking) => !status || booking.status === status)
            .map((booking, index) => (
              <MyBookingCard key={index} bookingDetails={booking} />
            ))
        ) : loading ? (
          <Spinner />
        ) : (
          <Text>No Bookings Found</Text>
        )}
      </SimpleGrid>
    </div>
  );
};

export default GetShopBooking;
