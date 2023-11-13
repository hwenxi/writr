FROM alpine:latest

RUN apk add --no-cache ca-certificates unzip

WORKDIR /app

COPY ./pocketbase /app/pocketbase

# Set the PocketBase binary as executable
RUN chmod +x /app/pocketbase

# Port exposed in docker compose

CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]
