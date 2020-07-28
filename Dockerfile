FROM node:14.5.0-stretch as builder
WORKDIR /react/app
ADD . .
RUN yarn install --network-timeout 1000000
RUN yarn build

FROM nginx:1.19.1-alpine
WORKDIR /etc/nginx/html
COPY --from=builder /react/app/build .
CMD ["sh", "-c", "exec nginx -g 'daemon off;'"]