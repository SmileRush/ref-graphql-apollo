FROM node:lts-alpine AS builder

WORKDIR /server

# 폴더는 하나씩
COPY src src
COPY .yarn .yarn

COPY package.json yarn.lock tsconfig.json .yarnrc.yml ./

RUN yarn && yarn build


FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /dist

COPY --from=builder /server/dist ./

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases .yarn/releases

RUN yarn workspaces focus --production

EXPOSE $PORT
ENTRYPOINT ["yarn"]
CMD ["start"]