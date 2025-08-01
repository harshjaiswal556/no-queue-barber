import {
  Button,
  FormControl,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useToast,
} from "@chakra-ui/react";
import "./Login.css";
import { useState } from "react";

const Login = ({ onClose }: any) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();

  const handleSubmit = async(e: React.FormEvent) =>{
    e.preventDefault();

    const userData = {
      email,
      password
    }

    try{
      const res = await fetch(`http://localhost:3000/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
    }catch(error){
      alert("Error! Please retry later")
      console.error(error);
    }
  }

  return (
    <ModalContent>
      <form onSubmit={handleSubmit}>
      <ModalHeader>Login</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
        <FormControl>
          <Input
            mb={2}
            type="email"
            className="login-input"
            placeholder="Enter Email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
          />
          <Input
            mt={2}
            type="password"
            className="login-input"
            placeholder="Enter Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
        </FormControl>
      </ModalBody>

      <ModalFooter>
        <Button type="submit" className="submit-btn" mr={3}>
          Login
        </Button>
        <Button variant="outline" onClick={onClose} className="cancel-btn">
          Cancel
        </Button>
      </ModalFooter>
      </form>
    </ModalContent>
  );
};

export default Login;
