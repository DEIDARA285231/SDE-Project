FROM node:12-slim
WORKDIR /www
ENV NODE_ENV development
RUN npm install
COPY . .
CMD ["npm", "start"]
EXPOSE 80
