FROM node as builder

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:slim

WORKDIR /app
ENV NODE_ENV production
COPY package.json yarn.lock ./

RUN yarn install --production
COPY --from=builder /usr/src/app/dist ./dist
COPY migrations migrations
RUN mkdir cocktail-library-static-storage

CMD [ "node", "dist/index.js" ]
