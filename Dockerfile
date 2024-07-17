FROM node:22-alpine as development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm ci --only-production

COPY --from=development /app/dist /app/dist

CMD ["node", "dist/server.js"]