# ================================
# Stage 1: Build Stage
# ================================
FROM node:22-slim AS builder

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy root package files
COPY package.json ./
COPY package-lock.json* ./

# Copy workspace package.json files
COPY apps/api/package.json ./apps/api/
COPY packages/calc/package.json ./packages/calc/
COPY packages/types/package.json ./packages/types/

# Install ALL dependencies (including devDependencies for build)
RUN npm install --workspaces --include-workspace-root

# Copy source code
COPY apps/api ./apps/api
COPY packages/calc ./packages/calc
COPY packages/types ./packages/types
COPY tsconfig.json* ./

# Generate Prisma client
RUN cd apps/api && npx prisma generate

# Build the API
RUN npm run build --workspace=@repo/api

# ================================
# Stage 2: Production Stage
# ================================
FROM node:22-slim AS production

# Install OpenSSL for Prisma runtime
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json ./
COPY package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY packages/calc/package.json ./packages/calc/
COPY packages/types/package.json ./packages/types/

# Install ONLY production dependencies
RUN npm install --workspaces --include-workspace-root --omit=dev

# Copy built artifacts from builder stage
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/node_modules/.prisma ./apps/api/node_modules/.prisma

# Copy shared packages source (needed at runtime for TS path resolution)
COPY packages/calc ./packages/calc
COPY packages/types ./packages/types

# Set working directory for the API
WORKDIR /app/apps/api

# Expose the port (Railway injects PORT env var)
EXPOSE 3000

# Run Prisma migrations and start the server
CMD ["sh", "-c", "ls -R /app/apps/api && npx prisma migrate deploy && node dist/main"]
