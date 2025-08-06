import { services } from "@/models/services.data";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Input,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Search from "./Search";
import { useState } from "react";

const Filters = ({ sendShopDataToParent }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [zipcode, setZipcode] = useState<string>("");
  const [serviceFilter, setServiceFilter] = useState<string[]>([]);

  const toast = useToast();

  const handleServiceFilter = (
    event: React.ChangeEvent<HTMLInputElement>,
    service: string
  ) => {
    if (event.target.checked) {
      setServiceFilter((prev) => [...prev, service]);
    } else {
      setServiceFilter((prev) => prev.filter((s) => s !== service));
    }
  };
  const options = services;

  const handleSearchData = (data: any) => {
    sendShopDataToParent(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let queryParams: string[] = [];

      if (serviceFilter.length > 0) {
        const servicesParam = `services=${serviceFilter.join(",")}`;
        queryParams.push(servicesParam);
      }

      if (zipcode.trim() !== "") {
        const zipcodeParam = `zipcode=${zipcode.trim()}`;
        queryParams.push(zipcodeParam);
      }

      const queryString =
        queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/shops/list${queryString}`
      );
      const data = await res.json();
      if (res.ok) {
        sendShopDataToParent(data.shops);
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
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <>
      <Box className="flex flex-row" gap={4} mx={5}>
        <Search sendSearchDataToParent={handleSearchData} />
        <Button leftIcon={<AddIcon />} className="submit-btn" onClick={onOpen}>
          More Filters
        </Button>
      </Box>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <form onSubmit={handleSubmit}>
            <DrawerHeader borderBottomWidth="1px">
              Filters For Easy Search!
            </DrawerHeader>

            <DrawerBody>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor="zipcode">Zipcode</FormLabel>
                  <Input
                    id="zipcode"
                    type="number"
                    placeholder="Enter Zipcode"
                    className="custom-input"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                  />
                </Box>

                <Box>
                  <FormLabel htmlFor="services">Select Services</FormLabel>
                  <Box className="flex flex-col">
                    {options.map((service, index) => (
                      <Checkbox
                        key={index}
                        colorScheme="green"
                        onChange={(e) => handleServiceFilter(e, service)}
                      >
                        {service}
                      </Checkbox>
                    ))}
                  </Box>
                </Box>
              </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="submit-btn">
                Submit
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default Filters;
