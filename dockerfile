FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY . .
RUN npm run build --prod   

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/skill-sheet/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
