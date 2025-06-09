# Step 1: Build the app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# # Build the Next.js app
# RUN npm run build

# # Step 2: Run the app with a smaller image
# FROM node:18-alpine AS runner

# WORKDIR /app

# # Install production dependencies only
# COPY --from=builder /app/package.json ./
# COPY --from=builder /app/package-lock.json* /app/yarn.lock* ./
# RUN \
#   if [ -f yarn.lock ]; then yarn install --production --frozen-lockfile; \
#   elif [ -f package-lock.json ]; then npm ci --only=production; \
#   else echo "No lock file found. Please use package-lock.json or yarn.lock." && exit 1; fi

# # Copy build output and public assets
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/next.config.js ./

# # Set environment variables (if needed)
# ENV NODE_ENV=production

# Expose Next.js default port
EXPOSE 3000

# # Start the server
# CMD ["npm", "start"]
