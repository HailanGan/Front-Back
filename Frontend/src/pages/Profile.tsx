import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Heading,
  Divider,
  Avatar,
  IconButton,
  useToast,
  Flex,
  Select,
} from "@chakra-ui/react";
import { FaCamera } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../services/api";
import PasswordSection from "./PasswordSection"; // 导入 PasswordSection 组件
import axios from "axios";

interface ProfileResponse {
  first_name: string;
  last_name: string;
  department: string;
  avatar_base64: string | null;
  email: string;
}

interface ProfileUpdatedResponse{
  message: string;
}

const DEPARTMENT_OPTIONS = [
  { value: 'Front-end', label: 'Front-end' },
  { value: 'Back-end', label: 'Back-end' },
  { value: 'UI/UX', label: 'UI/UX' },
];

const ProfilePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const toast = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    avatarUrl: '',
    email: ''
  });
  const [displayName, setDisplayName] = useState('');
  const [displayDepartment, setDisplayDepartment] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);



  useEffect(() => {
    const savedName = localStorage.getItem('displayName');
    if (savedName) {
      setDisplayName(savedName);
    }

    const saveDepartment = localStorage.getItem('displayDepartment');
    if (saveDepartment) {
      setDisplayDepartment(saveDepartment);
    }

    const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/");
        return;
      }

        const response = await axios.get<ProfileResponse>(
          'http://127.0.0.1:8001/api/users/profile/',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const { first_name, last_name, department, avatar_base64, email } = response.data;

        setUserData({
          firstName: first_name,
          lastName: last_name,
          department: department,
          avatarUrl: avatar_base64 || "",
          email: email
        });

        const newDisplayName = `${first_name} ${last_name}`;
        localStorage.setItem("displayName", newDisplayName);
        localStorage.setItem("displayDepartment", department);

        // setFirstName(first_name);
        // setLastName(last_name);
        // setDepartment(department);

        setDisplayName(`${first_name} ${last_name}`);
        setDisplayDepartment(`${department}`);
        setAvatarPreview(avatar_base64 || "");

      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserProfile();
  }, []);

  // 处理头像上传更改
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>{
        const base64String =  reader.result as string;
        setAvatarPreview(base64String);
        setSelectedFile(base64String); //直接存base64
      }
      reader.readAsDataURL(file);
    }
  };

  // 保存个人信息
  const handleSaveChanges = async () => {
    if (!firstName || !lastName || !department) {
      toast({
        title: "Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try{
      const token = localStorage.getItem("accessToken");

      const payload = {
        firstname: firstName,
        lastname: lastName,
        department: department,
        avatar_base64: selectedFile || null,
      }

      console.log("sending payload:", payload);

      const response = await axios.post<ProfileUpdatedResponse>(
          "http://127.0.0.1:8001/api/users/profile/",
          payload,
          {
            headers:{
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
      );

      console.log("Profile update response:", response.data);  // ✅ 确保后端返回的数据正确

      if (response.status === 200 && response.data.message) {  // ✅ 这里要检查 message 是否存在
        setDisplayName(`${firstName} ${lastName}`);
        setAvatarPreview(selectedFile || "");
        setDepartment(department);

        toast({
          title: "Success",
          description: response.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }else {
          throw new Error("Server response does not contain a success message.");
        }
      } catch (error: any) {
        console.error("Profile update error:", error);
        toast({
          title: "Error",
          description: "Failed to update profile.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

  return (
    <Box minH="100vh" display="flex" bg="gray.50" p={4}>
      {/* 顶部返回图标 */}
      <Flex position="absolute" top="20px" left="20px">
        <IconButton
          aria-label="Back to Dashboard"
          icon={<IoMdArrowRoundBack size="30px" />}
          onClick={() => navigate("/dashboard")}
        />
      </Flex>

      {/* 左侧菜单 */}
      <Box
        w="25%"
        p={4}
        bg="white"
        boxShadow="md"
        borderRadius="md"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      >
        <VStack spacing={3} mb={6} align="center" w="full">
          <Avatar size="xl" src={avatarPreview || ""} />
          <Text fontSize="md" fontWeight="bold">
            {displayName || firstName}
          </Text>
          <Text fontSize="md" fontWeight="bold">
            {displayDepartment || department}
          </Text>
        </VStack>

        <Heading size="md" mb={4}>
          Profile Settings
        </Heading>
        <Divider mb={4} />
        <VStack align="flex-start" spacing={4}>
          <Button
            variant={activeSection === "profile" ? "solid" : "outline"}
            colorScheme="blue"
            w="full"
            justifyContent="flex-start"
            onClick={() => setActiveSection("profile")}
          >
            Personal Information
          </Button>
          <Button
            variant={activeSection === "password" ? "solid" : "outline"}
            colorScheme="blue"
            w="full"
            justifyContent="flex-start"
            onClick={() => setActiveSection("password")}
          >
            Change Password
          </Button>
        </VStack>
      </Box>

      {/* 右侧内容 */}
      <Box flex="1" p={6} ml={4} bg="white" boxShadow="md" borderRadius="md">
        {activeSection === "profile" && (
          <Box>
            <Heading size="lg" mb={6}>
              Personal Information
            </Heading>
            <VStack align="flex-start" spacing={4}>
              <HStack>
                <Text fontWeight="bold" w="150px">
                  Avatar:
                </Text>
                <HStack>
                  <Input
                    type="file"
                    accept="image/*"
                    display="none"
                    id="file-upload"
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor="file-upload">
                    <IconButton
                      icon={<FaCamera />}
                      aria-label="Upload Avatar"
                      as="span"
                      cursor="pointer"
                    />
                  </label>
                </HStack>
              </HStack>

              <HStack>
                <Text fontWeight="bold" w="150px">
                  First Name:
                </Text>
                <Input
                  type="text"
                  placeholder="Enter your first name"
                  bg="gray.100"
                  borderRadius="md"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </HStack>
              <HStack>
                <Text fontWeight="bold" w="150px">
                  Last Name:
                </Text>
                <Input
                  type="text"
                  placeholder="Enter your last name"
                  bg="gray.100"
                  borderRadius="md"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </HStack>
              <HStack>
                <Text fontWeight="bold" w="150px">
                  Department:
                </Text>
                <Select
                  bg="gray.100"
                  borderRadius="md"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Select department"
                >
                  {DEPARTMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </HStack>
              <Button colorScheme="blue" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </VStack>
          </Box>
        )}

        {activeSection === "password" && <PasswordSection />}
      </Box>
    </Box>
  );
};

export default ProfilePage;