FROM golang:1.17

ARG PROJECT_NAME=app
ENV APP_HOME /srv
WORKDIR $APP_HOME

COPY go.* $APP_HOME/
RUN go mod download

COPY . .
ENV BINNAME ${PROJECT_NAME}
RUN make build && make install

CMD ["/srv/build/${PROJECT_NAME}"]