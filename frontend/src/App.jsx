import React, { Component } from "react";
import ChannelSection from "./channels/ChannelSection.jsx";
import "./App.css";
import UserSection from "./users/UserSection.jsx";
import MessageSection from "./messages/MessageSection.jsx";

class App extends Component {
  state = {
    channels: [],
    users: [],
    messages: [],
    activeChannel: {},
    connected: false,
  };

  addChannel(name) {
    let { channels } = this.state;
    channels.push({ id: channels.length, name });
    this.setState({ channels });
    // TODO: Send to server
  }
  setChannel(activeChannel) {
    this.setState({ activeChannel });
    // TODO: Get Channels Messages
  }

  setUserName = (name) => {
    const { users } = this.state;
    users.push({ id: users.length, name });

    this.setState({ users });
  };

  addMessage = (body) => {
    const { messages, users } = this.state;
    const createdAt = new Date();
    const author = users.length > 0 ? users[0].name : "anonymous";
    messages.push({ id: messages.length, body, createdAt, author });
    this.setState({ messages });
  };

  render() {
    return (
      <div className="app">
        <div className="nav">
          <ChannelSection
            {...this.state}
            addChannel={this.addChannel.bind(this)}
            setChannel={this.setChannel.bind(this)}
          />
          <UserSection {...this.state} setUserName={this.setUserName} />
          <MessageSection {...this.state} addMessage={this.addMessage} />
        </div>
      </div>
    );
  }
}

export default App;
