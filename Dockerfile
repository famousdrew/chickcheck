FROM node:22.12-slim

WORKDIR /app

ENV NODE_ENV=production

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy rest of app
COPY . .

# Build the app
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "run", "start"]
