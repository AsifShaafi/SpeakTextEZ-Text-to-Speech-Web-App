FROM node:16 as base

FROM base as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base as production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

ENV PORT=8080
EXPOSE 8080
CMD ["npm", "run", "start"]
