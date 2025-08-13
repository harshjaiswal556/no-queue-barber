import type { Bookings } from "@/models/bookings";
import { isLoggedIn } from "@/utils/auth";
import { Box, Button, SimpleGrid, useToast } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import MyBookingCard from "./MyBookingCard";
import Search from "@/components/Search";

const GetShopBooking = () => {
  const [myBookings, setMyBookings] = useState<Bookings[]>();

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
    console.log(data);
    setMyBookings(data);
  };

  return (
    <div>
      <Box className="flex">
        <Search
          sendSearchDataToParent={handleSearchData}
          isCustomerBooking={true}
        />
        <Button mx={2} px={6} variant={"outline"}>
          Upcoming
        </Button>
        <Button mx={2} px={6} variant={"outline"}>
          Cancelled
        </Button>
        <Button mx={2} px={6} variant={"outline"}>
          Completed
        </Button>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} spacing={4} mt={8}>
        {myBookings?.map((booking, index) => (
          <MyBookingCard key={index} bookingDetails={booking} />
        ))}
      </SimpleGrid>
    </div>
  );
};

export default GetShopBooking;
