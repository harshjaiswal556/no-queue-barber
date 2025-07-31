import {
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import "./Login.css";

const Login = ({ onClose }: any) => {
  return (
    <ModalContent>
      <ModalHeader>Create your account</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
        <FormControl>
          {/* <FormLabel>First name</FormLabel> */}
          <Input mb={2} className="sign-up-input" placeholder="First name" />
          {/* <FormLabel>Last name</FormLabel> */}
          <Input mt={2} className="sign-up-input" placeholder="Last name" />
        </FormControl>
      </ModalBody>

      <ModalFooter>
        <Button className="submit-btn" mr={3}>
          Save
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default Login;
