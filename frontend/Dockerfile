FROM node:20.14.0-alpine

WORKDIR /app
COPY . ./
RUN npm install

EXPOSE 8100

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]