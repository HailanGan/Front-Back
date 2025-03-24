import React, { useState } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  Text,
  VStack,
  Link,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from "../Components/Logo";
import { forgotPassword } from "../services/api";


interface ForgotPasswordResponse {
  message?: string; // 成功消息
  error?: string;   // 错误消息
}

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState(''); // 保存用户输入的邮箱
  const [loading, setLoading] = useState(false); // 按钮加载状态
  const toast = useToast(); // 通知组件
  const navigate = useNavigate(); // 路由跳转钩子

   const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = async () => {
  if (!email) {
    toast({
      title: "Error",
      description: "Please enter your email address.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  if (!validateEmail(email)) {
    toast({
      title: "Invalid Email",
      description: "Please enter a valid email address.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  setLoading(true);

  try {
    // 调用 forgotPassword 函数
    const response = await forgotPassword(email);
    localStorage.setItem("user_email", email); // 将 email 存储到 localStorage

    toast({
      title: "Success",
      description: response.message || "Password reset email sent.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // 跳转到成功页面
    navigate("/success");
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.response?.data?.error || "Failed to send reset email.",
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
      {/* 左上角 Logo */}
      <Logo />

      {/* 页面主体居中 */}
      <Flex flex="1" align="center" justify="center">
        <Box
          w={{ base: '90%', md: '500px' }}
          p={8}
          bg="white"
          borderRadius="md"
        >
          {/* 标题 */}
          <Heading as="h1" size="lg" mb={4} textAlign="center" fontWeight="bold">
            Forgot Password
          </Heading>

          {/* 描述文本 */}
          <Text mb={8} textAlign="center" color="gray.450" fontSize="sm">
            Please enter your registered email address and we will send you
            password reset instructions to this email.
          </Text>

          {/* 输入框和按钮 */}
          <VStack spacing={6} align="center">
            <Flex w="100%" align="center" justify="space-between">
              <Text fontWeight="bold" fontSize="large">
                Email Address:
              </Text>
              <Input
                placeholder="Enter your registered email"
                bg="gray.100"
                borderRadius={100}
                height="35px"
                w="60%"
                textAlign="center"
                value={email} // 绑定到输入框
                onChange={(e) => setEmail(e.target.value)} // 更新状态
              />
            </Flex>

            <Button
              colorScheme="blue"
              size="lg"
              w="full"
              borderRadius="100"
              width={150}
              height={10}
              mt={5}
              onClick={handleContinue}
              isLoading={loading} // 按钮加载状态
            >
              Continue
            </Button>
          </VStack>

          {/* 返回登录 */}
          <Text mt={6} textAlign="center" fontSize="sm" fontWeight="semibold">
            <RouterLink to="/">
              <Link color="black.500">Back to Login</Link>
            </RouterLink>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default ForgotPasswordPage;
