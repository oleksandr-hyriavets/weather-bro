FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Debug: List what was created
RUN ls -la /usr/src/app/
RUN ls -la /usr/src/app/dist/ || echo "dist folder not found"

EXPOSE 3000

CMD ["node", "dist/main.js"]