FROM node:latest

WORKDIR /opt/api-adapter

ADD . .

RUN yarn install

ENTRYPOINT ["npx", "ts-node", "-T", "index.ts"]