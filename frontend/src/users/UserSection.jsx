import { Component } from "react";
import UserForm from "./UserForm";
import UserList from "./UserList";

export default class UserSection extends Component {
  render() {
    return (
      <div className="support panel panel-primary">
        <div className="panel-heading">
          <strong>Users</strong>
        </div>
        <div className="panel-body users">
          <UserList {...this.props} />
          <UserForm {...this.props} />
        </div>
      </div>
    );
  }
}
