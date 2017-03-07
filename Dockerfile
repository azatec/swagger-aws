FROM node:alpine
MAINTAINER Nicolas Trangez <nicolas.trangez@scality.com>

RUN mkdir -p /usr/src/swagger-aws
WORKDIR /usr/src/swagger-aws

COPY package.json /usr/src/swagger-aws
RUN npm install
ENV PATH=/usr/src/swagger-aws/node_modules/.bin:$PATH

COPY . /usr/src/swagger-aws

RUN npm run jest -- --maxWorkers=2 && rm -rf coverage junit.xml
RUN npm run build

EXPOSE 9000 9001
CMD [ "npm-run-all", "--parallel", "--race", "serve", "webpack-dev-server -- --env coverage --host 0.0.0.0 --port 9001" ]
