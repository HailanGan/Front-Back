import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  Text,
  Link,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import Logo from "../Components/Logo";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 控制密码可见性

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword); // 切换密码显示/隐藏状态
  };

 // 定义用户信息接口
interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  avatar_base64?: string;
}

interface LoginResponse {
  message: string;
  tokens: {
    access: string;
    refresh: string;
  };
  user?: UserData;
}

const handleLogin = async () => {
 if (!email || !password) {
   toast({
     title: "Error",
     description: "Please fill in both email and password.",
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

 if (loading) return;
 setLoading(true);

 try {
    const response = (await loginUser(email, password)) as LoginResponse;
    const { tokens, user } = response;

    try {
      // 保存 tokens
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);

      // 如果有用户信息，则保存
      if (user) {
        localStorage.setItem("firstName", user.first_name);
        localStorage.setItem("lastName", user.last_name);
        localStorage.setItem("department", user.department);
        localStorage.setItem("displayName", `${user.first_name} ${user.last_name}`);

        // 保存头像Base64（如果存在）
        if (user.avatar_base64) {
          console.log("Saving avatar Base64:", user.avatar_base64);
          localStorage.setItem("avatar_base64", user.avatar_base64);
        }
      }

    } catch (e) {
      console.error("Error saving data to local storage:", e);
      toast({
        title: "Error",
        description: "Failed to save user data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Success",
      description: user ? `Welcome back, ${user.first_name}!` : "Welcome back!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    navigate("/Dashboard");
  } catch (error: any) {
   const errorMessage =
     error.response?.data?.message ||
     (error.message === "Network Error"
       ? "Unable to connect to the server. Please try again later."
       : "Invalid credentials.");
   toast({
     title: "Login Failed",
     description: errorMessage,
     status: "error",
     duration: 3000,
     isClosable: true,
   });
 } finally {
   setLoading(false);
 }
};

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Logo />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flex="1"
        mt={-20}
        overflowX={'hidden'}
      >
        <Box w={{ base: "90%", md: "500px" }} p={8} bg="white">
          <Heading
            as="h1"
            size="lg"
            mb={6}
            textAlign="center"
            lineHeight="1.5"
            fontWeight={"extrabold"}
          >
            User Login
          </Heading>

          <VStack spacing={7} align="center" width="100%">
            {/* Email 输入框 */}
            <InputGroup width="300px" mx="auto">
              <InputLeftElement pointerEvents="none">
                <EmailIcon color="gray.400" />
              </InputLeftElement>
              <Input
                type="email"
                placeholder="example@doenba.ai"
                fontSize={"sm"}
                bg="gray.100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>

            {/* Password 输入框 */}
            <InputGroup width="300px" mx="auto">
              <InputLeftElement pointerEvents="none">
                <LockIcon color="gray.400" />
              </InputLeftElement>
              <Input
                type={showPassword ? "text" : "password"} // 动态切换类型
                placeholder="Password"
                fontSize={"sm"}
                bg="gray.100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement>
                <Button
                  size="sm"
                  onClick={handleTogglePasswordVisibility}
                  bg="transparent"
                  _hover={{ bg: "transparent" }}
                >
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>

            <Button
              colorScheme="blue"
              onClick={handleLogin}
              isLoading={loading}
            >
              Log In
            </Button>
          </VStack>

          <Text mt={4} textAlign="center" fontSize={"sm"}>
            <RouterLink to="/forgot-password">
              <Link color="blue.500">Forgot Password?</Link>
            </RouterLink>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
