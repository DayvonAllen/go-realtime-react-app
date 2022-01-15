package main

import (
	"gopkg.in/rethinkdb/rethinkdb-go.v6"
	"net/http"
)

type Message struct {
	Name string      `gorethink:"name" json:"name"`
	Data interface{} `gorethink:"data" json:"data"`
}

type Channel struct {
	Id   string `gorethink:"id" json:"id"`
	Name string `gorethink:"name" json:"name"`
}

type User struct {
	Id   string `gorethink:"id" json:"id"`
	Name string `gorethink:"name" json:"name"`
}

func main() {
	session, err := rethinkdb.Connect(rethinkdb.ConnectOpts{
		Address:  "localhost:28015",
		Database: "rtsupport",
	})

	if err != nil {
		panic(err)
	}

	router := NewRouter(session)

	router.Handle("channel add", AddChannel)
	router.Handle("channel subscribe", SubscribeChannel)
	router.Handle("channel unsubscribe", UnsubscribeChannel)

	http.Handle("/", router)
	http.ListenAndServe(":4000", nil)
}
