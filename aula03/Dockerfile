FROM node:17-slim

RUN apt-get update \
    && apt-get install -y sox libsox-fmt-mp3

WORKDIR /Radio_Spotify/

COPY package.json package-lock.json /Radio_Spotify/

RUN npm ci --silent

COPY . .

USER node

CMD npm run live-reload