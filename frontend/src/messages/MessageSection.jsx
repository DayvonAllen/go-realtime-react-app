import { Component } from "react";
import MessageForm from "./MessageForm";
import MessageList from "./MessageList";

export default class MessageSection extends Component {
  render() {
    const { activeChannel } = this.props;
    return (
      <div className="messages-container panel panel-default">
        <div className="panel-heading">
          <strong>{activeChannel?.name}</strong>
        </div>
        <div className="panel-body messages">
          <MessageList {...this.props} />
          <MessageForm {...this.props} />
        </div>
      </div>
    );
  }
}
