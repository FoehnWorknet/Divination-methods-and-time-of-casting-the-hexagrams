# 构建阶段使用 node:18-alpine 以减小镜像体积
FROM node:18-alpine AS builder

# 设置淘宝 npm 镜像以加快下载速度
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com

# 安装构建依赖
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 创建必要的目录
RUN mkdir -p public

# 构建应用
RUN npm run build

# 生产阶段使用更小的基础镜像
FROM node:18-alpine AS runner

# 设置工作目录
WORKDIR /app

# 设置生产环境变量
ENV NODE_ENV=production \
    PORT=4500 \
    HOSTNAME="0.0.0.0" \
    TZ=Asia/Shanghai \
    NEXT_TELEMETRY_DISABLED=1

# 安装必要的系统依赖
RUN apk add --no-cache \
    libc6-compat \
    tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 创建必要的目录
RUN mkdir -p /app/public && chown nextjs:nodejs /app/public

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 安装生产依赖
RUN npm install --production

# 设置健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4500 || exit 1

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 4500

# 使用standalone模式启动
CMD ["node", "server.js"]