FROM node:12-alpine3.11 AS base
WORKDIR /usr/src/app/
COPY package*.json ./
RUN npm install
COPY . ./

FROM base as dev-local
CMD ["npm", "start"]

FROM base as build
RUN npm run build

FROM nginx:1.17.10-alpine as prod
COPY --from=build /usr/src/app/dist/demo/ /usr/share/nginx/html
COPY nginx-conf/nginx.conf /etc/nginx/conf.d/default.conf
