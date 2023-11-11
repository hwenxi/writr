FROM alpine:latest

RUN apk add --no-cache ca-certificates unzip

WORKDIR /app

COPY ./pocketbase /app/backend/pocketbase

# Set the PocketBase binary as executable
RUN chmod +x /app/backend/pocketbase

# Port exposed in docker compose

CMD ["./backend/pocketbase", "serve"]
