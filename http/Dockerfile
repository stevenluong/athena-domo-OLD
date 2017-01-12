FROM hypriot/rpi-node:latest
RUN mkdir /http
WORKDIR /http
ADD package.json /http/package.json
RUN npm install
RUN npm install -g http-server


