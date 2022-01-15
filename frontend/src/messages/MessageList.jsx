import { Component } from "react";
import Message from "./Message";

export default class MessageList extends Component {
  render() {
    return (
      <ul>
        {this.props.messages.map((message) => {
          return <Message key={message?.id} message={message} />;
        })}
      </ul>
    );
  }
}
