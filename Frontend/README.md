```devpolit-frontend/
├── public/                     # 静态资源
│   └── favicon.ico             # 网站图标
├── src/
│   ├── assets/                 # 静态资源（图片、字体、样式）
│   │   ├── images/             # 图片文件
│   │   └── styles/             # 全局样式
│   │       ├── global.css
│   │       └── variables.css
│   ├── components/             # 通用组件
│   ├── apps/                   # 子应用模块
│   │   ├── ai-assistant/       # AI 助手应用
│   │   │   ├── components/     # 子模块组件
│   │   │   │   ├── ChatBox.tsx
│   │   │   │   ├── Message.tsx
│   │   │   ├── pages/          # 子模块页面
│   │   │   │   ├── Main.tsx
│   │   │   │   ├── Settings.tsx
│   │   │   ├── context/        # 子模块状态管理
│   │   │   │   └── AssistantContext.tsx
│   │   │   ├── hooks/          # 子模块自定义 Hook
│   │   │   │   └── useAssistant.ts
│   │   │   ├── utils/          # 子模块工具函数
│   │   │   │   └── assistantUtils.ts
│   │   │   └── main.tsx       # 子模块入口
│   │   └── app2/               # 第二个子应用模块（预留）
│   ├── pages/                  # 通用页面
│   │   ├── Login.tsx           # 登录页面
│   │   ├── Dashboard.tsx       # 仪表盘页面
│   │   └── NotFound.tsx        # 404 页面
│   ├── context/                # 全局状态管理
│   │   ├── AuthContext.tsx     # 用户认证上下文
│   │   ├── AppContext.tsx      # 全局应用上下文
│   ├── hooks/                  # 全局自定义 Hook
│   │   ├── useAuth.ts          # 用户认证 Hook
│   │   └── useFetch.ts         # 通用数据请求 Hook
│   ├── services/               # API 服务
│   │   ├── api.ts              # Axios 实例配置
│   │   ├── authService.ts      # 用户认证 API
│   │   ├── assistantService.ts # AI 助手 API
│   ├── utils/                  # 通用工具函数
│   │   ├── formatDate.ts       # 日期格式化函数
│   │   ├── validateForm.ts     # 表单验证函数
│   │   └── constants.ts        # 全局常量
│   ├── App.tsx                 # 应用主组件
│   ├── App.css                 # 应用主组件css
│   ├── index.css               # 
│   ├── main.tsx                # 应用入口文件
│   ├── vite-env.d.ts           # 
│   ├── routes.tsx              # 路由配置
├── index.html                  # 主 HTML 模板
├── package.json                # 项目依赖配置
├── package-lock.json           
├── README.md                   # 项目说明文档
├── tsconfig.app.json             
├── tsconfig.json               # TypeScript 配置
├── tsconfig.node.json    
└── vite.config.ts     

```