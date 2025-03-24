import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { resendEmail } from "../services/api"; // 引入 Resend Email API 函数
import Logo from "../Components/Logo";

const ResetSuccessPage: React.FC = () => {
  const navigate = useNavigate(); // 创建 useNavigate 实例
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI Modal 控制
  const toast = useToast();
  const [loading, setLoading] = useState(false);


  const email = localStorage.getItem("user_email") || ""; // 从 localStorage 获取 email


  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await resendEmail(email); // 调用 Resend Email API
      onOpen(); // 打开成功弹窗
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.error || "Failed to resend the email. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/"); // 跳转到登录页
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="white">
      {/* 左上角 Logo */}
      <Logo />

      {/* 页面主体内容 */}
      <Flex
        flex="1"
        align="center"
        justify="center"
        direction="column"
        p={4}
        textAlign="center"
      >
        {/* Success Icon */}
        <Box color="green.400" mb={6}>
          <FaCheckCircle size="80px" />
        </Box>

        {/* 内容容器 */}
        <Box
          w={{ base: "90%", md: "600px" }}
          p={8}
          borderRadius="md"
          bg="white"
        >
          {/* 标题 */}
          <Heading as="h1" size="lg" mb={4} fontWeight="bold">
            Please check your email
          </Heading>

          {/* 描述信息 */}
          <Text mb={8} fontSize="sm" color="gray.450">
            We have emailed instructions on how to reset your password to the
            email address you specified.
          </Text>

          {/* 按钮组 */}
          <VStack spacing={5}>
            <Button
              colorScheme="blue"
              size="lg"
              borderRadius="30px"
              onClick={handleBackToLogin} // 绑定跳转事件
            >
              Back to login
            </Button>
            <Button
              colorScheme="gray"
              size="lg"
              borderRadius="30px"
              isLoading={loading} // 加载状态
              onClick={handleResendEmail} // 绑定 Resend Email 功能
            >
              Resend email
            </Button>
          </VStack>
        </Box>
      </Flex>

      {/* 成功弹窗 */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          maxW="500px"
          bg="white"
          borderRadius="20px"
          boxShadow="lg"
        >
          <ModalHeader fontWeight="bold" fontSize="lg" textAlign="center">
            Resend Email
          </ModalHeader>
          <ModalBody textAlign="center">
            <Text color="gray.600">Instructions have been resent to your email.</Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button colorScheme="blue" onClick={onClose} borderRadius="20px">
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ResetSuccessPage;
