FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./
COPY packages/database/package.json ./packages/database/
COPY apps/api/package.json ./apps/api/

RUN npm ci

COPY . .

# Generate Prisma client
RUN cd packages/database && npx prisma generate

# Build
RUN cd apps/api && npm run build

EXPOSE 3001

CMD ["node", "apps/api/dist/main.js"]
