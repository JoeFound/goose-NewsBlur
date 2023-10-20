FROM python:3.12.0b1-slim
RUN apt-get update && apt-get install gcc -y
RUN pip3 install locust
COPY perf/locust.py /perf/locust.py
WORKDIR /perf/