FROM node:22.12-slim AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (need devDeps for build)
RUN npm ci --include=dev

# Generate Prisma client
RUN npx prisma generate

# Copy rest of app
COPY . .

# Build the app
RUN npm run build

# Production image
FROM node:22.12-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files and install production deps only
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]
