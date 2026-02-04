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

import { useRef } from "react";

const Signup = ({ onClose }: any) => {
  const toast = useToast();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const phone = phoneRef.current?.value;
    const role = roleRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

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
                ref={nameRef}
              />
            </Flex>
            <Flex mb={2}>
              <Input
                type="email"
                className="custom-input"
                placeholder="Enter Email"
                ref={emailRef}
              />
            </Flex>
            <Flex gap={4} mb={2}>
              <Input
                type="text"
                className="custom-input"
                placeholder="Enter Contact Number"
                ref={phoneRef}
              />
              <Select
                className="custom-input"
                placeholder="Enter Role"
                ref={roleRef}
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
                ref={passwordRef}
              />
              <Input
                type="password"
                className="custom-input"
                placeholder="Enter Same Password"
                ref={confirmPasswordRef}
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
