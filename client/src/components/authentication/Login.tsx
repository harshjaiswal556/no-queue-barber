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
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { usersApi } from "@/api/usersApi";

const Login = ({ onClose }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const data = await usersApi.login(userData);
      if (data.ok) {
        navigate("/dashboard");
        toast({
          title: data.data.message,
          status: "success",
          duration: 5000,
        });

        dispatch(setUser(data.data.user));
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
    }
  };

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
              className="custom-input"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              mt={2}
              type="password"
              className="custom-input"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button type="submit" className="submit-btn" onClick={onClose} mr={3}>
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
