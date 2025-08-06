import { Search2Icon } from "@chakra-ui/icons";
import { Button, Input } from "@chakra-ui/react";

const Search = () => {
  return (
    <div className="flex flex-row w-full">
      <Input
        id="shopName"
        type="text"
        placeholder="Enter Shop Name"
        className="custom-input"
      />
      <Button leftIcon={<Search2Icon />} className="submit-btn" px={4} ml={4}>
        Search
      </Button>
    </div>
  );
};

export default Search;
