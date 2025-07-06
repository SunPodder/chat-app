# Frontend Dockerfile for monorepo
FROM oven/bun:1 AS build

# Set working directory to the root of the monorepo
WORKDIR /app

# Copy root package.json and lockfile first for better caching
COPY package*.json bun.lock ./

# Copy common folder (shared dependencies and types)
COPY common/ ./common/

# Copy ALL workspace directories so bun can resolve workspaces
COPY server/ ./server/
COPY web/ ./web/

# Install dependencies from root (this handles all deps including shared ones)
RUN bun install

# Set working directory to web for build
WORKDIR /app/web

# Build the app (make sure common folder is available)
ARG VITE_BACKEND_URL=http://localhost:5000
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN bun run build

# Production stage with nginx
FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/web/dist /usr/share/nginx/html

# Copy nginx config
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
