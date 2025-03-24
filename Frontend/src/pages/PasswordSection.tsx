import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Heading,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { updatePassword } from "../services/api";


interface PasswordSection {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}



const PasswordSection: React.FC = () => {
  const [passwords, setPasswords] = useState<PasswordSection>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();

  // 密码验证规则
  const isAtLeast8Chars = passwords.newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(passwords.newPassword);
  const hasLowerCase = /[a-z]/.test(passwords.newPassword);  const hasNumber = /\d/.test(passwords.newPassword);
  const hasSymbol = /[^A-Za-z0-9]/.test(passwords.newPassword);
  const passwordsMatch = passwords.newPassword === passwords.confirmPassword;

  const handleInputChange = (field: keyof PasswordSection) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const isFormValid = () => {
    return (
      passwords.currentPassword &&
      isAtLeast8Chars &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSymbol &&
      passwordsMatch
    );
  };

  const handleUpdatePassword = async () => {
    if (!isFormValid()) {
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
      await updatePassword(passwords.currentPassword, passwords.newPassword);
      toast({
        title: "Success",
        description: "Password updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // 清空表单
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Change Password
      </Heading>
      <VStack align="flex-start" spacing={4}>
        <HStack w="full">
          <Text fontWeight="bold" w="150px">
            Current Password:
          </Text>
          <InputGroup>
            <Input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter current password"
              bg="gray.100"
              borderRadius="md"
              value={passwords.currentPassword}
              onChange={handleInputChange("currentPassword")}
            />
            <InputRightElement>
              <Button
                size="sm"
                bg="transparent"
                _hover={{ bg: "transparent" }}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </HStack>

        <HStack w="full">
          <Text fontWeight="bold" w="150px">
            New Password:
          </Text>
          <InputGroup>
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              bg="gray.100"
              borderRadius="md"
              value={passwords.newPassword}
              onChange={handleInputChange("newPassword")}
            />
            <InputRightElement>
              <Button
                size="sm"
                bg="transparent"
                _hover={{ bg: "transparent" }}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </HStack>

        <HStack w="full">
          <Text fontWeight="bold" w="150px">
            Confirm Password:
          </Text>
          <InputGroup>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter new password"
              bg="gray.100"
              borderRadius="md"
              value={passwords.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
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
        </HStack>

        <Box pl="150px">
          <VStack align="start" spacing={2} mt={2} color="gray.600">
            <Text color={isAtLeast8Chars ? "green.500" : "red.500"}>
              • At least 8 characters
            </Text>
            <Text color={hasUpperCase ? "green.500" : "red.500"}>
              • At least 1 upper letter
            </Text>
            <Text color={hasLowerCase ? "green.500" : "red.500"}>
              • At least 1 lower letter
            </Text>
            <Text color={hasNumber ? "green.500" : "red.500"}>
              • At least 1 number
            </Text>
            <Text color={hasSymbol ? "green.500" : "red.500"}>
              • At least 1 symbol
            </Text>
            <Text color={passwordsMatch ? "green.500" : "red.500"}>
              • Passwords match
            </Text>
          </VStack>
        </Box>

        <Box pl="150px">
          <Button
            colorScheme="blue"
            onClick={handleUpdatePassword}
            isLoading={loading}
            isDisabled={!isFormValid()}
          >
            Update Password
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default PasswordSection;