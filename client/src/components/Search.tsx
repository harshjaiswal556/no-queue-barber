import { isLoggedIn } from "@/utils/auth";
import { Search2Icon } from "@chakra-ui/icons";
import { Button, Input, useToast } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useState } from "react";

const Search = ({ sendSearchDataToParent, isCustomerBooking = false }: any) => {
  const [shopName, setShopName] = useState<string>("");

  const toast = useToast();

  const token = Cookies.get("token");

  const searchAllShops = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }api/shops/list?shopName=${shopName}`
      );
      const data = await res.json();
      if (res.ok) {
        sendSearchDataToParent(data.shops);
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
      alert("Error! Please try later");
      console.error(error);
    }
  };

  const searchCustomerBookings = async (customerId: string | undefined) => {
    if (customerId === undefined) {
      return;
    }
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }api/bookings/list/customer/${customerId}?shopName=${shopName}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        sendSearchDataToParent(data.bookings);
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
      alert("Error! Please try later");
      console.error(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customerId = isLoggedIn()?.id;
    isCustomerBooking ? searchCustomerBookings(customerId) : searchAllShops();
  };
  return (
    <div className="w-full">
      <form className="flex flex-row" onSubmit={handleSubmit}>
        <Input
          id="shopName"
          type="text"
          placeholder="Enter Shop Name"
          className="custom-input"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />
        <Button
          type="submit"
          leftIcon={<Search2Icon />}
          className="submit-btn"
          px={6}
          ml={4}
        >
          Search
        </Button>
      </form>
    </div>
  );
};

export default Search;
