import type { Bookings } from "@/models/bookings";
import { isLoggedIn } from "@/utils/auth";
import { Box, Button, SimpleGrid, useToast } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import MyBookingCard from "./MyBookingCard";
import Search from "@/components/Search";

const GetShopBooking = () => {
  const [myBookings, setMyBookings] = useState<Bookings[]>();
  const [status, setStatus] = useState<string | null>();

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
      } else {
        setMyBookings(data.bookings);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filterBookingByStatus = (status: string | null) => {
    setStatus(status);
    console.log(myBookings);
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
      <Box className="flex">
        <Search
          sendSearchDataToParent={handleSearchData}
          isCustomerBooking={true}
        />
        <Button
          mx={2}
          px={6}
          variant={"outline"}
          disabled={status === "booked"}
          onClick={() => filterBookingByStatus("booked")}
        >
          Upcoming
        </Button>
        <Button
          mx={2}
          px={6}
          variant={"outline"}
          disabled={status === "cancelled"}
          onClick={() => filterBookingByStatus("cancelled")}
        >
          Cancelled
        </Button>
        <Button
          mx={2}
          px={6}
          variant={"outline"}
          disabled={status === "completed"}
          onClick={() => filterBookingByStatus("completed")}
        >
          Completed
        </Button>
        <Button
          mx={2}
          px={6}
          variant={"outline"}
          onClick={() => filterBookingByStatus(null)}
        >
          Clear Status
        </Button>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} spacing={4} mt={8}>
        {myBookings
          ?.filter((booking) => !status || booking.status === status)
          .map((booking, index) => (
            <MyBookingCard key={index} bookingDetails={booking} />
          ))}
      </SimpleGrid>
    </div>
  );
};

export default GetShopBooking;
