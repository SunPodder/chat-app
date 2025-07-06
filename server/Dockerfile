# Backend Dockerfile for monorepo
FROM oven/bun:1

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

# Set working directory to server
WORKDIR /app/server

# Create uploads directory
RUN mkdir -p public/uploads

# Expose port
EXPOSE 5000

# Start the server (make sure common folder is available)
CMD ["bun", "run", "dev"]
