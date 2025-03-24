import React from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Flex,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";

const ResetSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="white" overflow="hidden">
      <Logo />

      <Flex align="flex-start" justify="center" pt="150px" overflow="hidden">
        <Box textAlign="center" w={{ base: "90%", md: "700px" }} p={8}>
          <Icon as={FaCheckCircle} w={20} h={20} color="green.500" mb={6} />

          <VStack spacing={6}>
            <Heading as="h1" size="lg">
              Password Reset Successful!
            </Heading>

            <Text fontSize="lg" color="gray.600">
              Your password has been successfully updated. You can now log in with your new password.
            </Text>

            <Button
              colorScheme="blue"
              size="lg"
              borderRadius="30px"
              onClick={() => navigate("/")}
              mt={4}
            >
              Return to Login
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default ResetSuccessPage;