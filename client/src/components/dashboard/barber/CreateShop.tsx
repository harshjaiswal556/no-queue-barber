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
import { BeatLoader } from "react-spinners";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./CreateShop.css";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import type { RootState } from "../../../store/auth/authStore";
import { storage } from "@/utils/firebase";
import { services } from "@/models/services.data";
import { shopAPI } from "@/api/shopsApi";

const CreateShop = ({ onClose }: any) => {
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState<string>("");
  const [shopZipcode, setShopZipcode] = useState<string>("");
  const [shopStart, setShopStart] = useState<string | null>(null);
  const [shopEnd, setShopEnd] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<
    Record<string, { price: number; time: number }>
  >({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();
  const user = useSelector((state: RootState) => state.auth.user);

  const token = Cookies.get("token");

  const options = services;

  const toggleOption = (option: string) => {
    setSelectedServices((prev) => {
      if (prev[option]) {
        const newState = { ...prev };
        delete newState[option];
        return newState;
      }
      return { ...prev, [option]: { price: 0, time: 0 } };
    });
  };

  const updateServiceDetail = (
    serviceName: string,
    field: "price" | "time",
    value: number
  ) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceName]: {
        ...prev[serviceName],
        [field]: value,
      },
    }));
  };

  const removeOption = (option: string) => {
    setSelectedServices((prev) => {
      const newState = { ...prev };
      delete newState[option];
      return newState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageFileUrl = "";

      if (imageFile) {
        const imageRef = ref(storage, `shops/${Date.now()}-${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageFileUrl = await getDownloadURL(imageRef);
      }

      const shopData = {
        barber_id: user?._id,
        shopName,
        address: shopAddress,
        zipcode: shopZipcode,
        services: selectedServices,
        start: shopStart,
        end: shopEnd,
        imageUrl: imageFileUrl,
      };

      // const res = await fetch(`http://localhost:3000/api/shops/create`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   credentials: "include",
      //   body: JSON.stringify(shopData),
      // });
      // const data = await res.json();

      const data = await shopAPI.createShop(shopData, token);

      if (data.ok) {
        toast({
          title: data.data.message,
          status: "success",
          duration: 5000,
        });
        onClose();
      } else {
        toast({
          title: data.data.message,
          status: "error",
          duration: 5000,
        });
      }
    } catch (error) {
      alert("Error! Please retry later");
      console.error(error);
    } finally {
      setIsLoading(false);
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
                    {Object.keys(selectedServices).length === 0 && (
                      <Box color="gray.400">Select Services...</Box>
                    )}

                    <Wrap>
                      {Object.keys(selectedServices).map((service) => (
                        <Tag
                          size="md"
                          key={service}
                          borderRadius="full"
                          variant="solid"
                          colorScheme="blue"
                        >
                          <TagLabel>
                            {service} - ₹{selectedServices[service].price} /{" "}
                            {selectedServices[service].time} min
                          </TagLabel>
                          <TagCloseButton
                            onClick={(e) => {
                              e.stopPropagation();
                              removeOption(service);
                            }}
                          />
                        </Tag>
                      ))}
                    </Wrap>

                    <ChevronDownIcon ml="auto" />
                  </Flex>
                </MenuButton>

                <MenuList>
                  {options.map((option) => {
                    const isSelected = !!selectedServices[option];
                    const serviceData = selectedServices[option];

                    return (
                      <MenuItem
                        key={option}
                        onClick={() => toggleOption(option)}
                        bg={isSelected ? "blue.50" : "white"}
                        _hover={{ bg: "gray.100" }}
                      >
                        <Flex
                          align="center"
                          justify="space-between"
                          w="full"
                          gap={2}
                        >
                          <Text>{option}</Text>
                          {isSelected && (
                            <Flex gap={2} onClick={(e) => e.stopPropagation()}>
                              <Input
                                type="number"
                                placeholder="Price"
                                value={serviceData.price || ""}
                                onChange={(e) =>
                                  updateServiceDetail(
                                    option,
                                    "price",
                                    Number(e.target.value)
                                  )
                                }
                                w="70px"
                                size="sm"
                              />
                              <Input
                                type="number"
                                placeholder="Time"
                                value={serviceData.time || ""}
                                onChange={(e) =>
                                  updateServiceDetail(
                                    option,
                                    "time",
                                    Number(e.target.value)
                                  )
                                }
                                w="60px"
                                size="sm"
                              />
                            </Flex>
                          )}
                        </Flex>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
              <Box>
                <Input
                  type="file"
                  className="shop-input"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                />
              </Box>
            </Flex>
            <Flex gap={4}>
              <Input
                type="number"
                className="shop-input"
                placeholder="Enter Zipcode"
                value={shopZipcode}
                onChange={(e) => setShopZipcode(e.target.value)}
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
          <Button
            type="submit"
            className="submit-btn"
            mr={3}
            colorScheme="blue"
            isLoading={isLoading}
            spinner={<BeatLoader size={8} color="white" />}
          >
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
