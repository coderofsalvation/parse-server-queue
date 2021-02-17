FROM node:alpine3.10

#USER node

ENV PORT 1337

ENV PARSE_HOME /home/node/parse-server

RUN mkdir -p ${PARSE_HOME}
ADD ./package.json ${PARSE_HOME}
ADD ./index.js ${PARSE_HOME}
ADD ./ParseQ.js ${PARSE_HOME}
RUN chown node:node ${PARSE_HOME}/*

WORKDIR ${PARSE_HOME}

RUN npm install --production

EXPOSE ${PORT}

CMD [ "npm", "start" ]
