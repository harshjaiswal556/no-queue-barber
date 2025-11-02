import { Spinner } from "@chakra-ui/react";

const Loading = () => {
  return (
    <div>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.400"
        color="black"
        size="xl"
      />
    </div>
  );
};

export default Loading;
