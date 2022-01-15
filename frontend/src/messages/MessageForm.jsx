import { Component } from "react";

export default class MessageForm extends Component {
  state = {
    message: "",
  };

  updateMessage = (e) => {
    e.preventDefault();
    this.setState({ message: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.addMessage(this.state.message);
    this.setState({ message: "" });
  };

  render() {
    let input;
    if (this.props?.activeChannel?.id) {
      input = (
        <input
          type="text"
          onChange={this.updateMessage}
          value={this.state.message}
          className="form-control"
          placeholder="Add Message..."
        />
      );
    }
    return (
      <form onSubmit={this.onSubmit}>
        <div className="form-group">{input}</div>
      </form>
    );
  }
}
