// this comes from Node.js
// provides a nice pattern for event based message passing.
import { EventEmitter } from "events";

export default class Socket {
  constructor(ws = new WebSocket("ws:localhost:4000"), ee = new EventEmitter()) {
    this.ws = ws;
    this.ee = ee;
    ws.onmessage = this.message;
    ws.onopen = this.open;
    ws.close = this.close;
  }

  message = (e) => {
    try {
      const message = JSON.parse(e?.data);
      this.ee.emit(message?.name, message?.data);
    } catch (err) {
      this.ee.emit("error", err);
    }
  };

  open = () => {
    this.ee.emit("connect");
  };

  close = () => {
    this.ee.emit("disconnect");
  };

  // emits events/ send messages
  emit = (eventName, data) => {
    const message = JSON.stringify({ eventName, data });
    this.ws.send(message);
  };

  // listen to events on a channel
  on = (eventName, fn) => {
    this.ee.on(eventName, fn);
  };

  // remove event listener, unsubscribe
  off = (eventName, fn) => {
    this.ee.removeListener(eventName, fn);
  };
}

// create instance of an event emitter
// const ee = new EventEmitter();

// const addChannel = (channel) => {

// }

// adds a channel to listen on
// in this case the channel is "channel add"
// the "addChannel" function will handle the event
// ee.on("channel add", addChannel)

// emits an event, and allows us to send a message
// ee.emit("channel add", message)
