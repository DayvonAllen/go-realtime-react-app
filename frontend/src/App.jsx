import React, { Component } from "react";
import ChannelSection from "./channels/ChannelSection.jsx";
import "./App.css";
import UserSection from "./users/UserSection.jsx";
import MessageSection from "./messages/MessageSection.jsx";
import Socket from "./socket";

class App extends Component {
  state = {
    channels: [],
    users: [],
    messages: [],
    activeChannel: {},
    connected: false,
  };

  socket = new Socket();

  componentDidMount() {
    this.socket.on("connect", this.onConnect);
    this.socket.on("disconnect", this.onDisconnect);
    this.socket.on("channel add", this.onAddChannel);
    this.socket.on("user add", this.onAddUser);
    this.socket.on("user edit", this.onEditUser);
    this.socket.on("user remove", this.onRemoveUser);
    this.socket.on("message add", this.onMessageAdd);
  }

  onMessageAdd = (message) => {
    let { messages } = this.state;
    messages.push(message);
    this.setState({ messages });
  };

  onAddUser = (user) => {
    const { users } = this.state;

    users.push(user);

    this.setState({ users });
  };

  onEditUser = (editUser) => {
    let { users } = this.state;

    users = users.map((user) => {
      if (user.id === editUser.id) {
        return editUser;
      }
      return user;
    });

    this.setState({ users });
  };

  onRemoveUser = (removeUser) => {
    let { users } = this.state;

    users = users.filter((user) => user.id !== removeUser.id);

    this.setState({ users });
  };

  onConnect = () => {
    this.setState({ connected: true });
    // we know the websocket is connected at this point so we subscribe to the channel here
    this.socket.emit("channel subscribe");
    this.socket.emit("user subscribe");
  };

  onDisconnect = () => {
    this.setState({ connected: false });
  };

  onAddChannel(channel) {
    let { channels } = this.state;
    channels.push(channel);
    this.setState({ channels });
  }

  addChannel(name) {
    this.socket.emit("channel add", { name });
  }

  setChannel(activeChannel) {
    this.setState({ activeChannel });
    this.socket.emit("message unsubscribe");
    this.setState({ messages: [] });
    this.socket.emit("message subscribe", { channelId: activeChannel?.id });
  }

  setUserName = (name) => {
    this.socket.emit("user edit", { name });
  };

  addMessage = (body) => {
    const { activeChannel } = this.state;

    this.socket.emit("message add", { channelId: activeChannel?.id, body });
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
