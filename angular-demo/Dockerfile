FROM node:alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN $(npm bin)/ng build

FROM nginx
COPY --from=builder /app/dist/demo/ /usr/share/nginx/html
COPY nginx-conf/nginx.conf /etc/nginx/conf.d/default.conf
