import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import { useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import "./CreateShop.css";
import { ChevronDownIcon } from "@chakra-ui/icons";

const CreateShop = ({ onClose }: any) => {
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopZipcode, setShopZipcode] = useState("");
  const [shopStart, setShopStart] = useState<string | null>(null);
  const [shopEnd, setShopEnd] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const toast = useToast();

  const options = ["React", "Vue", "Angular", "Svelte"];

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const removeOption = (option: string) => {
    setSelected((prev) => prev.filter((item) => item !== option));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const shopData = {
      shopName,
      shopAddress,
      shopZipcode,
      selected,
      shopStart,
      shopEnd
    };

    try {
      const res = await fetch(`http://localhost:3000/api/shops/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(shopData),
      });
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
      alert("Error! Please retry later");
      console.error(error);
    }
  };

  return (
    <ModalContent>
      <form onSubmit={handleSubmit}>
        <ModalHeader>Add Your Shop Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <Flex mb={4}>
              <Input
                type="text"
                className="shop-input"
                placeholder="Enter Shop Name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
            </Flex>
            <Flex mb={4}>
              <Input
                type="text"
                className="shop-input"
                placeholder="Enter Shop Address"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
              />
            </Flex>
            <Flex mb={4} gap={4}>
              <Menu closeOnSelect={false}>
                <MenuButton as={Box} w="full">
                  <Flex
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                    p={2}
                    minH="40px"
                    align="center"
                    wrap="wrap"
                    gap={2}
                    cursor="pointer"
                  >
                    {selected.length === 0 && (
                      <Box color="gray.400">Select Services...</Box>
                    )}
                    <Wrap>
                      {selected.map((item) => (
                        <Tag
                          size="md"
                          key={item}
                          borderRadius="full"
                          variant="solid"
                          colorScheme="blue"
                        >
                          <TagLabel>{item}</TagLabel>
                          <TagCloseButton
                            onClick={(e) => {
                              e.stopPropagation(); 
                              removeOption(item);
                            }}
                          />
                        </Tag>
                      ))}
                    </Wrap>
                    <ChevronDownIcon ml="auto" />
                  </Flex>
                </MenuButton>

                <MenuList>
                  {options.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => toggleOption(option)}
                      bg={selected.includes(option) ? "blue.50" : "white"}
                      _hover={{ bg: "gray.100" }}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
            <Flex gap={4}>
              <Input
                type="number"
                className="shop-input"
                placeholder="Enter Zipcode"
                value={shopZipcode}
                onChange={(e)=>setShopZipcode(e.target.value)}
              />
              <Box className="input-time shop-input bg-white rounded w-full">
                <Text w={120}>Open Time</Text>
                <TimePicker
                  className="w-full custom-timepicker"
                  disableClock={true}
                  clearIcon={null}
                  value={shopStart}
                  onChange={(value: string | null) => setShopStart(value)}
                />
              </Box>
              <Box className="input-time shop-input bg-white rounded w-full">
                <Text w={125}>Close Time</Text>
                <TimePicker
                  className="w-full custom-timepicker"
                  disableClock={true}
                  clearIcon={null}
                  value={shopEnd}
                  onChange={(value: string | null) => setShopEnd(value)}
                />
              </Box>
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

export default CreateShop;
