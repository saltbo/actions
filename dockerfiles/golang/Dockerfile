FROM golang:1.17

ENV APP_HOME /app
WORKDIR $APP_HOME

COPY go.* $APP_HOME/
RUN go mod download

COPY . .
RUN BINNAME=cmd make build && make install

ENTRYPOINT ["/app/cmd"]