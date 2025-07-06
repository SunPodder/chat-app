# Multi-stage Dockerfile for monorepo
# This is optional - docker-compose is the recommended approach

# Stage 1: Build Frontend
FROM oven/bun:1 AS frontend-build
WORKDIR /app

# Copy root dependencies and common folder
COPY package*.json bun.lock ./
COPY common/ ./common/

# Copy ALL workspace directories so bun can resolve workspaces
COPY server/ ./server/
COPY web/ ./web/

# Install dependencies from root
RUN bun install

# Set working directory to web for build
WORKDIR /app/web
ARG VITE_BACKEND_URL=http://localhost:5000
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN bun run build

# Stage 2: Build Backend
FROM oven/bun:1 AS backend-build
WORKDIR /app

# Copy root dependencies and common folder
COPY package*.json bun.lock ./
COPY common/ ./common/

# Copy ALL workspace directories so bun can resolve workspaces
COPY server/ ./server/
COPY web/ ./web/

# Install dependencies from root
RUN bun install

# Stage 3: Production
FROM oven/bun:1
WORKDIR /app

# Install nginx and curl
USER root
RUN apt-get update && apt-get install -y nginx curl && rm -rf /var/lib/apt/lists/*

# Copy common folder to production image
COPY common/ ./common/

# Copy backend from build stage
COPY --from=backend-build /app/server /app/server
WORKDIR /app/server
RUN mkdir -p public/uploads

# Copy frontend build to nginx
COPY --from=frontend-build /app/web/dist /usr/share/nginx/html
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'nginx &' >> /app/start.sh && \
    echo 'cd /app/server && bun run dev' >> /app/start.sh && \
    chmod +x /app/start.sh

# Switch back to bun user
USER bun

EXPOSE 80 5000

CMD ["/app/start.sh"]
