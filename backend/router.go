package main

import (
	"github.com/gorilla/websocket"
	"gopkg.in/rethinkdb/rethinkdb-go.v6"
	"net/http"
)

type Handler func(*Client, interface{})

type Router struct {
	rules   map[string]Handler
	session *rethinkdb.Session
}

// the upgrader attempts to hijack the connection and switches the protocol from HTTP to websockets
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// default only allow connections from the same origin when using websockets
	// we override that behavior and allow connections from any origin
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func NewRouter(session *rethinkdb.Session) *Router {
	return &Router{
		rules:   make(map[string]Handler),
		session: session,
	}
}
func (e *Router) Handle(msgName string, handler Handler) {
	e.rules[msgName] = handler
}

func (e *Router) FindHandler(msgName string) (Handler, bool) {
	handler, found := e.rules[msgName]
	return handler, found
}

func (e *Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	socket, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		w.WriteHeader(500)
		return
	}

	client := NewClient(socket, e.FindHandler, e.session)
	defer client.Close()
	go client.Write()
	client.Read()
}
