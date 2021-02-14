FROM ubuntu
WORKDIR /www
RUN apt-get update
RUN apt-get install -y apt-transport-https ca-certificates
RUN apt-get install -y gnupg2 
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 
RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list 
RUN apt-get update
RUN apt-get install -y mongodb-org 
RUN rm -rf /var/lib/apt/lists/
COPY . .
CMD ["mongod"]
EXPOSE 80
