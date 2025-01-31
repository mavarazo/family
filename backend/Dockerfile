FROM golang:1.23.5-alpine as builder

ENV CGO_ENABLED=1

RUN apk add --no-cache \
    # Important: required for go-sqlite3
    gcc \
    # Required for Alpine
    musl-dev

ENV GO_ENV=production
ENV GOOS=linux

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . . 
RUN go build -o main

FROM alpine:latest AS runtime

ENV GO_ENV=production
ENV GIN_MODE=release

WORKDIR /app

COPY --from=builder /app/main .
RUN mkdir -p /app/data

EXPOSE 8080
CMD ["./main"]
