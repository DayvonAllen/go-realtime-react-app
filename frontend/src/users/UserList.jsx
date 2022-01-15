import { Component } from "react";
import User from "./User";

export default class UserList extends Component {
  render() {
    return (
      <ul>
        {this.props.users.map((user) => {
          return <User key={user.id} user={user} />;
        })}
      </ul>
    );
  }
}
