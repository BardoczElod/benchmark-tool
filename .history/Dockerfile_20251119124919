# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# install dependencies
COPY package.json package-lock.json ./
RUN npm ci --silent

# copy sources and build
COPY . .
RUN npm run build

# Production stage - nginx serves the static files
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
