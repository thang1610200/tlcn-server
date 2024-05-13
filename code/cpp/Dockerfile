FROM gcc:latest

RUN apt-get update && apt-get install -y \
    cmake \
    git \
    make \
    google-mock

RUN git clone -q https://github.com/google/googletest.git /googletest

RUN mkdir -p /googletest/build

RUN cd /googletest/build \
    && cmake .. && make && make install \
    && cd / && rm -rf /googletest


