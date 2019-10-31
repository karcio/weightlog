FROM node:10.17.0-alpine
EXPOSE 3000 9229 5432

RUN apk add --no-cache git

WORKDIR /app
ADD start.sh $WORKDIR

CMD sh start.sh