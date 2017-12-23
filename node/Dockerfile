FROM hypriot/rpi-node:latest
RUN mkdir /node
WORKDIR /node
ADD package.json /node/package.json
RUN npm install
RUN npm install -g http-server
#RUN apt-get install espeak


