import { Search2Icon } from "@chakra-ui/icons";
import { Button, Input, useToast } from "@chakra-ui/react";
import { useState } from "react";

const Search = ({ sendSearchDataToParent }: any) => {
  const [shopName, setShopName] = useState<string>("");

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          px={4}
          ml={4}
        >
          Search
        </Button>
      </form>
    </div>
  );
};

export default Search;
