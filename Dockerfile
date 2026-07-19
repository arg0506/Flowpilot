# Stage 1: Dependency Installation & Compilation
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package references
COPY package*.json ./
RUN npm ci

# Copy source tree
COPY . .

# Run production compilation
RUN npm run build

# Stage 2: Minimalist Production Image
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled bundles from compiler stage
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
