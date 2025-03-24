import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Flex,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/api";
import Logo from "../Components/Logo";

const PasswordResetPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // 控制密码可见性
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 控制确认密码可见性

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  console.log("UID:", uid);  // 应该输出 2
  console.log("Token:", token);  // 应该输出 FgjuP4VlahBppgBCimFvPl4R3jfJzOBh

  const isAtLeast8Chars = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== "";

  const allValid =
    isAtLeast8Chars && hasLetter && hasNumber && hasSymbol && passwordsMatch;

  const handleSubmit = async () => {
  if (!uid || !token) {
    toast({
      title: "Error",
      description: "Invalid or missing URL parameters.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  if (!allValid) {
    toast({
      title: "Error",
      description: "Please fix all password requirements before submitting.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  setLoading(true);

  try {
    await resetPassword(uid, token, password); // 调用后端 API
    toast({
      title: "Success",
      description: "Password reset successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/reset-success"); // 跳转到成功页面
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.response?.data?.error || "An unexpected error occurred.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="white">
      <Logo />

      <Flex align="flex-start" justify="center" overflow="hidden" pt="150px">
        <Box textAlign="center" w={{ base: "90%", md: "700px" }} p={8}>
          <Heading as="h1" size="lg" mb={10}>
            Reset Your Password
          </Heading>

          <VStack spacing={6} align="stretch">
            <Flex align="center" justify="space-between">
              <Text fontWeight="bold" w="30%" textAlign="center">
                New Password:
              </Text>
              <InputGroup w="50%">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  bg="gray.100"
                  borderRadius="30px"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  textAlign="center"
                />
                <InputRightElement>
                  <Button
                    size="sm"
                    bg="transparent"
                    _hover={{ bg: "transparent" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Flex>

            <Flex align="center" justify="space-between">
              <Text fontWeight="bold" w="30%" textAlign="center">
                Re-enter New Password:
              </Text>
              <InputGroup w="50%">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter New Password"
                  bg="gray.100"
                  borderRadius="30px"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  textAlign="center"
                />
                <InputRightElement>
                  <Button
                    size="sm"
                    bg="transparent"
                    _hover={{ bg: "transparent" }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Flex>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={7} ml={10}>
            <HStack color={isAtLeast8Chars ? "green.500" : "red.500"}>
              {isAtLeast8Chars ? <FaCheckCircle /> : <FaTimesCircle />}
              <Text>At least 8 characters</Text>
            </HStack>
            <HStack color={hasLetter ? "green.500" : "red.500"}>
              {hasLetter ? <FaCheckCircle /> : <FaTimesCircle />}
              <Text>At least 1 letter</Text>
            </HStack>
            <HStack color={hasNumber ? "green.500" : "red.500"}>
              {hasNumber ? <FaCheckCircle /> : <FaTimesCircle />}
              <Text>At least 1 number</Text>
            </HStack>
            <HStack color={hasSymbol ? "green.500" : "red.500"}>
              {hasSymbol ? <FaCheckCircle /> : <FaTimesCircle />}
              <Text>At least 1 symbol</Text>
            </HStack>
            <HStack color={passwordsMatch ? "green.500" : "red.500"}>
              {passwordsMatch ? <FaCheckCircle /> : <FaTimesCircle />}
              <Text>Passwords match</Text>
            </HStack>
          </SimpleGrid>

          <Button
            colorScheme="blue"
            size="lg"
            borderRadius="30px"
            mt={8}
            isDisabled={!allValid}
            isLoading={loading}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default PasswordResetPage;
