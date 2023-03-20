FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN yarn install
RUN yarn build

EXPOSE $PORT
CMD [ "yarn", "start" ]