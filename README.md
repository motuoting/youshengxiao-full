# 幼升小注意事项 - 完整版

## 项目说明

包含前端网页 + 后端API + 数据库的完整系统。

## 本地运行

### 1. 安装依赖
```bash
cd C:\Users\Administrator\Desktop\youshengxiao-full
npm install
```

### 2. 启动服务
```bash
npm start
```

### 3. 访问
- 前端：http://localhost:3000
- API接口：http://localhost:3000/api/qa

## 部署到 Render.com（免费）

### 准备工作
1. 注册 Render.com：https://render.com
2. 用 GitHub 账号登录

### 部署步骤

#### 1. 创建 GitHub 仓库
在 GitHub 创建新仓库 `youshengxiao-full`，上传本文件夹所有内容

#### 2. 创建 Render Web Service
1. 登录 Render Dashboard：https://dashboard.render.com
2. 点击 **New +** → **Web Service**
3. 选择你的 GitHub 仓库
4. 配置：
   - Name: `youshengxiao`
   - Region: Singapore（离中国近）
   - Branch: `main`
   - Root Directory: （留空）
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free**

5. 点击 **Create Web Service**

#### 3. 等待部署完成
- 自动安装依赖
- 自动启动服务
- 免费实例会休眠（15分钟无访问后），再次访问会自动唤醒

#### 4. 访问你的网站
- URL: `https://youshengxiao.onrender.com`（或你自定义的子域名）

## 功能说明

### 普通用户
- 查看所有问答
- 提交新问题
- 筛选：全部/已回复/待回复

### 管理员
- 用户名: `admin`
- 密码: `admin123`
- 登录后可编辑/回复/删除所有问题

## 数据库

使用 SQLite（文件型数据库）
- 本地：`youshengxiao.db`
- 云端：Render 免费提供持久化存储

## 技术栈

- 前端：HTML + CSS + JavaScript
- 后端：Node.js + Express
- 数据库：SQLite
- 部署：Render.com（免费）

## 文件结构

```
youshengxiao-full/
├── package.json          # 项目配置
├── server.js            # 后端服务
├── public/
│   └── index.html        # 前端网页
└── README.md            # 说明文档
```
