package main

import (
	"fmt"
	"github.com/mitchellh/mapstructure"
	"gopkg.in/rethinkdb/rethinkdb-go.v6"
)

const (
	ChannelStop = iota
	UserStop
	MessageStop
)

func AddChannel(client *Client, data interface{}) {
	var channel Channel
	err := mapstructure.Decode(data, &channel)
	if err != nil {
		client.send <- Message{"error", err.Error()}
		return
	}
	go func() {
		err = rethinkdb.Table("channel").Insert(channel).Exec(client.session)
		if err != nil {
			client.send <- Message{"error", err.Error()}
			return
		}
	}()
}

func Subscribe(session *rethinkdb.Session, stop <-chan bool) {
	cursor, _ := rethinkdb.Table("channel").Changes().Run(session)

	var change rethinkdb.ChangeResponse

	result := make(chan rethinkdb.ChangeResponse)

	go func() {
		for cursor.Next(&change) {
			result <- change
		}
	}()

	for {
		select {
		case change := <-result:
			fmt.Println(change.NewValue)
		case <-stop:
			cursor.Close()
			return
		}
	}
}

func SubscribeChannel(client *Client, data interface{}) {
	var change rethinkdb.ChangeResponse

	result := make(chan rethinkdb.ChangeResponse)

	stop := client.NewStopChannel(ChannelStop)
	cursor, err := rethinkdb.Table("channel").Changes(rethinkdb.ChangesOpts{IncludeInitial: true}).Run(client.session)
	if err != nil {
		client.send <- Message{"error", err.Error()}
		return
	}

	go func() {
		for cursor.Next(&change) {
			result <- change
		}
	}()
	go func() {
		for {
			select {
			case change := <-result:
				if change.NewValue != nil && change.OldValue == nil {
					client.send <- Message{"channel add", change.NewValue}
					fmt.Println(change.NewValue)
				}
			case <-stop:
				cursor.Close()
				return
			}
		}
	}()
}

func UnsubscribeChannel(client *Client, data interface{}) {
	client.StopForKey(ChannelStop)
}
