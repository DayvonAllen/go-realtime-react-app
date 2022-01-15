import { Component } from "react";

export default class UserForm extends Component {
  state = {
    userName: "",
  };

  updateName = (e) => {
    e.preventDefault();
    this.setState({ userName: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.setUserName(this.state.userName);
    this.setState({ ...this.state, userName: "" });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <input
            refs="userName"
            onChange={this.updateName}
            value={this.state.userName}
            type="text"
            className="form-control"
            placeholder="Set Your Name..."
          />
        </div>
      </form>
    );
  }
}
