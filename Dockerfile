FROM node:latest

COPY . .
RUN apt-get update
RUN apt-get install -y postgresql-client
RUN npm install
ENV POSTGRES_HOST=eve-postgres
CMD ["npm", "start"]
