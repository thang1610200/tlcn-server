FROM openjdk:11

RUN apt-get update && \
    apt-get install -y junit

ENV CLASSPATH=".:/usr/share/java/junit.jar"

WORKDIR /code