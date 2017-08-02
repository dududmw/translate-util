FROM daocloud.io/library/node:6.6.0

RUN npm set registry https://registry.npm.taobao.org/

ADD fe /fe/
WORKDIR /fe/
RUN npm install
RUN npm run rel

ADD translate /translate/
WORKDIR /translate/
RUN npm install

EXPOSE 9000
CMD ["node", "./app.js"]
