FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN yarn install
ENV NODE_ENV=production
RUN yarn build

CMD [ "yarn", "start" ]