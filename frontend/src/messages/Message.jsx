import { Component } from "react";
import fecha from "fecha";

export default class Message extends Component {
  render() {
    const { message } = this.props;
    const createdAt =
      message?.id && fecha.format(message.createdAt, "mediumDate");

    return (
      <li className="message">
        <div className="author">
          <strong>{message?.author}</strong>
          <i className="timestamp">{createdAt}</i>
        </div>
        <div className="body">{message?.body}</div>
      </li>
    );
  }
}
