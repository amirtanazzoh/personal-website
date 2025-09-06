# Base image with Node.js
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy packages
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the NestJS app
RUN npm run build

# === Production image ===
FROM node:20-slim

WORKDIR /app

# Only copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables (if needed)
ENV NODE_ENV=production

# Expose the port your Nest app listens on
EXPOSE 3000

#Expose the port for websocket
EXPOSE 8000

# Start the app
CMD ["node", "dist/src/main"]
