import { Component } from "react";

export default class User extends Component {
  render() {
    return <li>{this.props.user.name}</li>;
  }
}
