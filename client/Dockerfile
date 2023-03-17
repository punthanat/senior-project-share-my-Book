FROM node:16.14-alpine3.14 as build
WORKDIR /app
COPY package.json ./
RUN npm install -g yarn --force
RUN yarn install
COPY . ./
RUN yarn build

FROM node:16.4-alpine3.14 as runner
WORKDIR /app
COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

ENV PORT 80

CMD ["yarn", "start"]