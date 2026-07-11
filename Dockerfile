FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 确保主配置中 gzip 模块启用
RUN echo 'gzip on;' > /etc/nginx/conf.d/gzip.conf 2>/dev/null || true

STOPSIGNAL SIGQUIT
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
