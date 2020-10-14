FROM node:latest

COPY . .
RUN npm install
ENV POSTGRES_HOST=eve-postgres
CMD ["npm", "start"]