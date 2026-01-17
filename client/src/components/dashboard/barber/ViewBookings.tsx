import { bookingsAPI } from "@/api/bookingsApi";
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface Bookings {
  customer_name: string;
  services: string[];
  date: string;
  time_slot: {
    start: string;
    end: string;
  };
  payment_status: string;
}

const ViewBookings = ({ shopId, shopName }: any) => {
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchBookings = async () => {
      const queryString = `limit=10&page=0`;
      const data = await bookingsAPI.getBookingsByShopId(
        shopId,
        queryString,
        token
      );
      console.log(data);
      setBookings(data.data.bookings);
    };
    fetchBookings();
  }, []);
  return (
    <ModalContent>
      <ModalHeader>View Bookings</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <TableContainer>
          <Table variant="simple">
            <TableCaption>
              All upcoming bookings for {shopName} shop.
            </TableCaption>
            <Thead>
              <Tr>
                <Th>S.No</Th>
                <Th>Customer Name</Th>
                <Th>Services</Th>
                <Th>Date</Th>
                <Th>Time Slot</Th>
                <Th>Payment</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bookings && bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <Tr>
                    <Td>{index + 1}</Td>
                    <Td>{booking?.customer_name}</Td>
                    <Td>{booking?.services.join(", ")}</Td>
                    <Td>{dayjs(booking?.date).format("DD-MM-YYYY")}</Td>
                    <Td>
                      {booking?.time_slot.start} - {booking?.time_slot.end}
                    </Td>
                    <Td>{booking?.payment_status}</Td>
                  </Tr>
                ))
              ) : (
                <div>No Bookings Found</div>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </ModalBody>
    </ModalContent>
  );
};

export default ViewBookings;
