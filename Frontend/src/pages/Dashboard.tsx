import React, {useEffect, useState} from "react";
import {
  Box,
  Heading,
  Flex,
  Text,
  VStack,
  HStack,
  Avatar,
  Button,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa"; // 引入 FaStar
import { useNavigate } from "react-router-dom"; // 引入 useNavigate
import Logo from "../Components/Logo";
import { getFavorites, addFavorite, removeFavorite } from "../services/api";
import axios from "axios";

interface ProfileUpdatedResponse{
  avatar_base64: string | null;
  message: string;
}


const DashboardPage: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  // 修改 useEffect 中获取头像URL的逻辑：
    useEffect(() => {
     const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found.");
        return;
      }

      // 发送请求获取用户信息
      const response = await axios.get<ProfileUpdatedResponse>("http://127.0.0.1:8001/api/users/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.avatar_base64){
        let avatar = response.data.avatar_base64;

        if (!avatar.startsWith("data:image")){
          avatar = `data:image/png;base64,${avatar}`;
        }
       console.log("Fetched avatar from backend:", avatar);
        setAvatarUrl(avatar);
      } else {
        console.warn("No avatar found in backend response.");
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  fetchUserProfile();

      // 获取收藏夹
      const fetchFavorites = async () => {
        try {
          const favorites = await getFavorites();
          setFavorites(favorites || []);
        } catch (error) {
          console.error("Failed to fetch favorites", error);
          setFavorites([]);
        }
      };
      fetchFavorites();
    }, []);



  const handleFavoriteToggle = async (toolId: string) => {
  try {
    if (isFavorite(toolId)) {
      await removeFavorite(toolId);
      setFavorites(prev => prev.filter(id => id !== toolId));
    } else {
      await addFavorite(toolId);
      setFavorites(prev => [...prev, toolId]);
    }
  } catch (error: any) {
    console.error("Failed to update favorite:", error.response?.data || error.message);
  }
};

const handleExternalLink = (url: string) => {
  window.open(url, "_blank"); // 在新标签页打开
};



  // 工具数据
  const tools = [
    {
      id: "ai-chat",
      section: "AI Tools",
      name: "AI Chat",
      description:
        "Facilitate seamless and intelligent conversations by leveraging AI to understand and respond to user queries effectively.",
      path: "/chat", // 跳转路径
    },
    {
      id: "doenba-email",
      section: "Team Tools",
      name: "Doenba Email",
      description:
        "Streamline communication by sending, receiving, and organizing messages for efficient correspondence and collaboration.",
      path: "https://librum.awsapps.com/auth/?client_id=6b9615ec01be1c8d&redirect_uri=https%3A%2F%2Fwebmail.mail.us-east-1.awsapps.com%2Fworkmail%2F", // 跳转路径
    },
  ];

  // 检查是否为收藏
  const isFavorite = (toolId: string) => favorites.includes(toolId);


    return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="white" overflow-x={"hidden"}>
      <Logo />

      {/* Header: 头像和下拉菜单 */}
      <HStack
        position="absolute"
        top="4"
        right="8"
        spacing={4}
        align="center"
      >
        <Menu>
          <MenuButton>
            <Avatar
              name="User"
              src={avatarUrl || "/default-avatar.png"}
            />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
            <MenuItem
              onClick={() => {
                // 清除所有存储的数据
                localStorage.clear();
                navigate("/");
              }}
            >
              Log Out
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {/* 页面主体 */}
      <Box minH="100vh" bg="white" p={8}>
        {/* My Favorites Section */}
        <Box mb={8}>
          <Heading size="lg" mb={4}>
            My Favorites
          </Heading>
          {favorites.length === 0 ? (
            <Text color="gray.500">You have no favorite tools yet.</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {tools
                .filter((tool) => favorites.includes(tool.id)) // 筛选收藏的工具
                .map((tool) => (
                  <Flex
                    key={tool.id}
                    p={4}
                    w="300px"
                    borderRadius="3xl"
                    bg="gray.200"
                    justify="space-between"
                    align="center"
                    cursor="pointer"
                    _hover={{ bg: "gray.300" }}
                    onClick={() =>
                      tool.path.startsWith("http")
                        ? handleExternalLink(tool.path) // 外部链接打开新标签页
                        : navigate(tool.path) // 内部链接用 react-router 跳转
                    }
                  >
                    <Box>
                      <Heading size="md" mb={3}>
                        {tool.name}
                      </Heading>
                      <Text fontSize="sm" color="gray.600">
                        {tool.description}
                      </Text>
                    </Box>
                    <Box
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止点击事件冒泡
                        handleFavoriteToggle(tool.id);
                      }}
                      cursor="pointer"
                    >
                      <FaStar
                        size="24px"
                        color={isFavorite(tool.id) ? "#d4af37" : "gray"}
                      />
                    </Box>
                  </Flex>
                ))}
            </SimpleGrid>
          )}
        </Box>

        {/* AI Tools Section */}
        <Box mb={8}>
          <Heading size="lg" mb={4}>
            AI Tools
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {tools
              .filter((tool) => tool.section === "AI Tools") // 筛选 AI Tools
              .map((tool) => (
                <Flex
                  key={tool.id}
                  p={4}
                  borderRadius="3xl"
                  w="300px"
                  bg="gray.200"
                  justify="space-between"
                  align="center"
                  cursor="pointer"
                  _hover={{ bg: "gray.300" }}
                  onClick={() => navigate("/chat")} // 点击跳转
                >
                  <Box>
                    <Heading size="md" mb={3}>
                      {tool.name}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      {tool.description}
                    </Text>
                  </Box>
                  <Box
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止点击事件冒泡
                      handleFavoriteToggle(tool.id);
                    }}
                    cursor="pointer"
                  >
                    <FaStar
                      size="24px"
                      color={isFavorite(tool.id) ? "#d4af37" : "gray"}
                    />
                  </Box>
                </Flex>
              ))}
          </SimpleGrid>
        </Box>

        {/* Team Tools Section */}
        <Box>
          <Heading size="lg" mb={4}>
            Team Tools
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {tools
              .filter((tool) => tool.section === "Team Tools") // 筛选 Team Tools
              .map((tool) => (
                <Flex
                  key={tool.id}
                  p={4}
                  borderRadius="3xl"
                  w="300px"
                  bg="gray.200"
                  justify="space-between"
                  align="center"
                  cursor="pointer"
                  _hover={{ bg: "gray.300" }}
                  onClick={() =>
                    tool.path.startsWith("http")
                      ? handleExternalLink(tool.path) // 外部链接打开新标签页
                      : navigate(tool.path) // 内部链接用 react-router 跳转
                  }
                >
                  <Box>
                    <Heading size="md" mb={3}>
                      {tool.name}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      {tool.description}
                    </Text>
                  </Box>
                  <Box
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止点击事件冒泡
                      handleFavoriteToggle(tool.id);
                    }}
                    cursor="pointer"
                  >
                    <FaStar
                      size="24px"
                      color={isFavorite(tool.id) ? "#d4af37" : "gray"}
                    />
                  </Box>
                </Flex>
              ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
