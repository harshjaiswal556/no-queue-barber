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
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { usersApi } from "@/api/usersApi";

const Login = ({ onClose }: any) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    const userData = {
      email,
      password,
    };

    try {
      const data = await usersApi.login(userData);
      localStorage.setItem("name", data.data.user.name);
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
              ref={emailRef}
            />
            <Input
              mt={2}
              type="password"
              className="custom-input"
              placeholder="Enter Password"
              ref={passwordRef}
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
