import { usersApi } from "@/api/usersApi";
import {
  Button,
  Flex,
  FormControl,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  useToast,
} from "@chakra-ui/react";

import { useState } from "react";

const Signup = ({ onClose }: any) => {
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("customer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) return alert("Password is not matching");

    const userData = {
      name,
      email,
      phone,
      role,
      password,
    };

    try {
      const data = await usersApi.register(userData);
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
      alert("Error! Please try later");
      console.error(error);
    }
  };

  return (
    <ModalContent>
      <form onSubmit={handleSubmit}>
        <ModalHeader>Create your account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <Flex mb={2}>
              <Input
                type="name"
                className="custom-input"
                placeholder="Enter Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Flex>
            <Flex mb={2}>
              <Input
                type="email"
                className="custom-input"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Flex>
            <Flex gap={4} mb={2}>
              <Input
                type="text"
                className="custom-input"
                placeholder="Enter Contact Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Select
                className="custom-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Enter Role" disabled selected>
                  Enter Role
                </option>
                <option value="customer">Customer</option>
                <option value="barber">Barber</option>
              </Select>
            </Flex>
            <Flex gap={4}>
              <Input
                type="password"
                className="custom-input"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type="password"
                className="custom-input"
                placeholder="Enter Same Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Flex>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" className="submit-btn" mr={3}>
            Create your account
          </Button>
          <Button variant="outline" onClick={onClose} className="cancel-btn">
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};

export default Signup;
