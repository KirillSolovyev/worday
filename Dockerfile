# Build
FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./
#Use --legacy-peer-deps because of nestjs-telegraf@2.8.1
RUN npm ci --legacy-peer-deps
COPY . .

# Run the development server
FROM base AS dev
CMD ["npm", "run", "start:dev"]

# Build the application
FROM base AS builder
RUN npm run build

# Copy only the necessary files to the final image and run the app
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
# Copy data source file for migrations
COPY --from=builder /app/src/providers/db-provider/data-source.ts ./src/providers/db-provider/data-source.ts
EXPOSE 3210

CMD ["node", "dist/src/main"]