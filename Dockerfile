FROM node:alpine
MAINTAINER Nicolas Trangez <nicolas.trangez@scality.com>

RUN mkdir -p /usr/src/swagger-aws
WORKDIR /usr/src/swagger-aws

COPY package.json /usr/src/swagger-aws
RUN npm install

COPY . /usr/src/swagger-aws

RUN npm run jest && rm -rf coverage junit.xml
RUN npm run build

EXPOSE 9000
CMD [ "npm", "run", "serve" ]
