FROM python:3.10-slim

LABEL version="1.0"
LABEL maintainer="Ian Ansell"

WORKDIR /home/app

COPY haas/ haas/
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT gunicorn haas:app