package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"gopkg.in/rethinkdb/rethinkdb-go.v6"
)

type FindHandler func(string) (Handler, bool)
type Client struct {
	send         chan Message
	socket       *websocket.Conn
	handler      FindHandler
	session      *rethinkdb.Session
	stopChannels map[int]chan bool
}

func (client *Client) NewStopChannel(stopKey int) chan bool {
	client.StopForKey(stopKey)
	stop := make(chan bool)
	client.stopChannels[stopKey] = stop
	return stop
}

func (client *Client) Write() {
	defer client.socket.Close()
	for msg := range client.send {
		fmt.Println(msg)
		err := client.socket.WriteJSON(&msg)
		if err != nil {
			return
		}
	}
}

func (client *Client) Read() {
	defer client.socket.Close()
	var message Message
	for {
		err := client.socket.ReadJSON(&message)
		if err != nil {
			return
		}

		handler, found := client.handler(message.Name)

		if found {
			handler(client, message.Data)
		}
	}
}

func (client *Client) Close() {
	for _, ch := range client.stopChannels {
		ch <- true
	}

	close(client.send)
}

func (client *Client) StopForKey(key int) {
	if ch, found := client.stopChannels[key]; found {
		ch <- true
		delete(client.stopChannels, key)
	}
}

func NewClient(socket *websocket.Conn, handler FindHandler, session *rethinkdb.Session) *Client {
	return &Client{
		send:    make(chan Message),
		socket:  socket,
		handler: handler,
		session: session,
	}
}
