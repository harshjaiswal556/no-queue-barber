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

import "./Signup.css";
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
      const res = await fetch(`http://localhost:3000/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
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
              className="sign-up-input"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Flex>
          <Flex mb={2}>
            <Input
              type="email"
              className="sign-up-input"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Flex>
          <Flex gap={4} mb={2}>
            <Input
              type="text"
              className="sign-up-input"
              placeholder="Enter Contact Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Select
              className="sign-up-input"
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
              className="sign-up-input"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              className="sign-up-input"
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
