import axios from "axios";

// 接口定义
interface LoginResponse {
  tokens: {
    access: string;
    refresh: string;
  };
  message: string;
}

interface ResetPasswordResponse {
  message: string;
}

interface ResetPasswordErrorResponse {
  error: string;
}

interface ForgotPasswordResponse {
  message: string;
}

interface UpdateProfileResponse {
  message: string;
}

interface FavoriteResponse {
  favorites: string[];
  message?: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  folderId?: string;
}

interface Folder {
  id: string;
  name: string;
  created_at: Date;
}

// 添加 AI 模型配置接口
interface AIModelConfig {
  url: string;
  headers: Record<string, string>;
  buildBody: (message: string) => any;
  parseResponse: (data: any) => { id: string; content: string };
}

// Axios 实例配置
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8001/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 用户认证相关 API
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post('http://127.0.0.1:8001/api/users/login/', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post<ForgotPasswordResponse>("/users/forgot-password/", {
    email,
  });
  localStorage.setItem("user_email", email);
  return response.data;
};

export const resendEmail = async (email: string): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post<ForgotPasswordResponse>("/users/resend-email/", {
    email,
  });
  return response.data;
};

export const resetPassword = async (
  uid: string | null,
  token: string | null,
  password: string
): Promise<void> => {
  if (!uid || !token) {
    throw new Error("Missing uid or token.");
  }

  await axios.post("http://127.0.0.1:8001/api/users/reset-password/", {
    uid,
    token,
    password,
  });
};

export const updateProfile = async (
  firstName: string,
  lastName: string,
  department: string,
  avatarBase64?: string | null
) => {
  // 修改后的实现逻辑（示例）
  const token = localStorage.getItem("accessToken");

  const response = await axios.put(
    'http://127.0.0.1:8001/api/users/profile/',
    {
      first_name: firstName,
      last_name: lastName,
      department: department,
      avatar_base64: avatarBase64, // 后端字段也要相应匹配
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const getFavorites = async (): Promise<string[]> => {
  const token = localStorage.getItem("accessToken");
  const response = await apiClient.get<FavoriteResponse>('/users/favorites/', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.favorites;
};



export const addFavorite = async (toolId: string): Promise<void> => {
  const token = localStorage.getItem("accessToken");
  await apiClient.post('/users/favorites/',
    { tool_id: toolId },
    { headers: { Authorization: `Bearer ${token}` }}
  );
};

export const removeFavorite = async (toolId: string): Promise<void> => {
  const token = localStorage.getItem("accessToken");
  await apiClient.delete(`/users/favorites/${toolId}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updatePassword = async (currentPassword: string, newPassword: string) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.put(
    "http://127.0.0.1:8001/api/users/change-password/",
    {
      current_password: currentPassword,
      new_password: newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// 聊天相关的 API
export const chatApi = {
  getHistory: async (): Promise<Message[]> => {
    const token = localStorage.getItem("accessToken");
    const response = await apiClient.get<Message[]>('/chats/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  sendMessage: async (content: string): Promise<Message> => {
    const token = localStorage.getItem("accessToken");
    const response = await apiClient.post<Message>('/chat/stream/',
      { content },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  },

  deleteMessage: async (messageId: string): Promise<void> => {
    const token = localStorage.getItem("accessToken");
    await apiClient.delete(`/chats/${messageId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
};

// 文件夹相关的 API
export const folderApi = {
  getFolders: async (): Promise<Folder[]> => {
    const token = localStorage.getItem("accessToken");
    const response = await apiClient.get<Folder[]>('/folders/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  createFolder: async (name: string): Promise<Folder> => {
    const token = localStorage.getItem("accessToken");
    const response = await apiClient.post<Folder>('/folders/',
      { name },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  },

  updateFolder: async (folderId: string, name: string): Promise<Folder> => {
    const token = localStorage.getItem("accessToken");
    const response = await apiClient.put<Folder>(`/folders/${folderId}/`,
      { name },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  },

  deleteFolder: async (folderId: string): Promise<void> => {
    const token = localStorage.getItem("accessToken");
    await apiClient.delete(`/folders/${folderId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  addChatToFolder: async (chatId: string, folderId: string): Promise<void> => {
    const token = localStorage.getItem("accessToken");
    await apiClient.post(`/folders/${folderId}/chats/`,
      { chat_id: chatId },
      { headers: { Authorization: `Bearer ${token}` }}
    );
  },

  removeChatFromFolder: async (chatId: string, folderId: string): Promise<void> => {
    const token = localStorage.getItem("accessToken");
    await apiClient.delete(`/folders/${folderId}/chats/${chatId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  getFolderChats: async (folderId: string): Promise<Message[]> => {
    const token = localStorage.getItem("accessToken");
    const response = await apiClient.get<Message[]>(`/folders/${folderId}/chats/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

// WebSocket 聊天连接类
export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private messageCallback: ((message: any) => void) | null = null;
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("accessToken");
  }

  connect() {
    this.ws = new WebSocket(`ws://127.0.0.1:8001/ws/chat/?token=${this.token}`);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (this.messageCallback) {
        this.messageCallback(data);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // 自动重连
      setTimeout(() => this.connect(), 3000);
    };
  }

  sendMessage(content: string, p: { model: string }) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ message: content }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  onMessage(callback: (message: any) => void) {
    this.messageCallback = callback;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}



export default apiClient;